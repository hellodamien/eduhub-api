import * as fs from 'fs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AddRessourceDto } from './dto/add-ressource.dto';
import { Role, User } from 'generated/prisma';
import { PrismaService } from '../database/prisma.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly prismaService: PrismaService,
  ) { }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }

  // Pour l'exemple ici, normalement seuls l'admin et le prof peuvent
  // ajouter des ressources et le prof doit être celui en charge du cours
  // @Roles(Role.ADMIN, Role.TEACHER)
  @Public() // À retirer une fois la vérification du prof implémentée
  @Post(':id/ressources')
  @UseInterceptors(FileInterceptor('file'))
  async addRessource(
    @Param('id') id: string,
    @Body() addRessourceDto: AddRessourceDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    // 1. Récupérer le cours associé à l'id -> récupérer le teacherId
    const course = await this.prismaService.course.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    // Si pas trouvé, throw NotFoundException
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    // 2. Vérifier que l'utilisateur connecté est bien le prof du cours
    const user = req.user as User;
    if (user.role === Role.TEACHER && user.id !== course.teacherId) {
      throw new ForbiddenException(
        'You do not have permission to add resources to this course',
      );
    }

    // 3. Sauvegarder la ressource (fichier + métadonnées) en base de données
    console.log('Param id:', id);
    console.log('Body: ', addRessourceDto);
    console.log('File: ', file);
    fs.writeFile(`./uploads/${file.originalname}`, file.buffer, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      } else {
        console.log('File saved successfully');
      }
    });
    return `This action adds a new resource to course #${id}`;
  }
}
