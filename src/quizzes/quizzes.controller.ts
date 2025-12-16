import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Quiz } from './entities/quiz.entity';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) { }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a quiz for a course using AI' })
  @ApiResponse({
    status: 200,
    description: 'Quiz generated successfully',
    type: Quiz,
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found or no resources available',
  })
  async generateQuiz(@Body() generateQuizDto: GenerateQuizDto): Promise<Quiz> {
    return this.quizzesService.generateQuiz(generateQuizDto);
  }
}
