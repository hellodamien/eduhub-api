import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { generateObject } from 'ai';
import { mistral } from '@ai-sdk/mistral';
import { z } from 'zod';
import * as fs from 'fs/promises';

@Injectable()
export class QuizzesService {
  constructor(private prismaService: PrismaService) { }

  async generateQuiz(generateQuizDto: GenerateQuizDto): Promise<Quiz> {
    const { courseId, numberOfQuestions = 5 } = generateQuizDto;

    // Fetch the course with its resources
    const course = await this.prismaService.course.findUnique({
      where: { id: courseId },
      include: {
        ressources: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    if (!course.ressources || course.ressources.length === 0) {
      throw new NotFoundException(
        `No resources found for course ${course.title}`,
      );
    }

    // Read all resource files content
    const resourceContents = await Promise.all(
      course.ressources.map(async (resource) => {
        const resourcePath = `${process.cwd()}/uploads/courses/${course.id}/${resource.filePath}`;
        try {
          const content = await fs.readFile(resourcePath, 'utf-8');
          return {
            title: resource.title,
            content: content,
          };
        } catch (error) {
          console.error(`Error reading file ${resourcePath}:`, error);
          return null;
        }
      }),
    );

    // Filter out any failed reads
    const validResources = resourceContents.filter((r) => r !== null);

    if (validResources.length === 0) {
      throw new NotFoundException(
        `Could not read any resources for course ${course.title}`,
      );
    }

    // Build the prompt with course content
    const resourcesText = validResources
      .map((r) => `Resource: ${r.title}\n${r.content}`)
      .join('\n\n---\n\n');

    const prompt = `Based on the following course materials for "${course.title}", generate ${numberOfQuestions} multiple-choice quiz questions. 
Each question should have 4 options and one correct answer with an explanation.
Generate in the following locale: fr-FR.

Course Materials:
${resourcesText}

Generate diverse questions that test understanding of the key concepts from these materials.`;

    // Define the schema for the quiz
    const quizSchema = z.object({
      questions: z.array(
        z.object({
          question: z.string().describe('The question text'),
          options: z
            .array(z.string())
            .length(4)
            .describe('Four possible answers'),
          correctAnswerIndex: z
            .number()
            .describe('The correct answer index from the options'),
          explanation: z
            .string()
            .describe('Explanation of why this answer is correct'),
        }),
      ),
    });

    // Generate the quiz using AI
    const { object } = await generateObject({
      model: mistral('mistral-medium'),
      schema: quizSchema,
      prompt: prompt,
    });

    // Return the formatted quiz
    return {
      courseId: course.id,
      questions: object.questions,
    };
  }
}
