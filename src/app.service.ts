import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  getHello(): string {
    return 'Hello World (auto deploy)!';
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }
}
