import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }

  async createUser(createUserDto: CreateUserDto) {
    // const user = await this.prismaService.user.create({
    //   data: createUserDto,
    // });
    // return user;
  }
}
