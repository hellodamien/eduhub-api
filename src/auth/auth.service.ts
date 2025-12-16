import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { UserStatus } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async signIn(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user) {
      const isPasswordValid = password === user.password; //await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Generate JWT token
        const payload = { sub: user.id, email: user.email };
        return await this.jwtService.signAsync(payload);
      }
    }
    throw new UnauthorizedException();
  }

  async register(email: string, password: string, pin: string) {
    const matchingUser = await this.prismaService.user.findFirst({
      where: { email, registerPin: pin, status: UserStatus.PENDING },
    });

    if (!matchingUser) {
      throw new UnauthorizedException('Invalid email or PIN');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prismaService.user.update({
      where: { email },
      data: {
        email,
        password: hashedPassword,
      },
    });

    const payload = { sub: newUser.id, email: newUser.email };
    return await this.jwtService.signAsync(payload);
  }
}
