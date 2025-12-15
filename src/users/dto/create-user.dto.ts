import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsEnum(Role)
  @ApiProperty()
  role: Role;
}
