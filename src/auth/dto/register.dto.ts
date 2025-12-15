import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty()
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, { message: 'PIN must be a 6-digit number' })
  @ApiProperty()
  pin: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and can include special characters',
  })
  @ApiProperty()
  password: string;
}
