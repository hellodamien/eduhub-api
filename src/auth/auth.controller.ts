import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return JSON.stringify({ token });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.pin,
    );
  }

  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
