import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6)
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
  //   message:
  //     'Password must contain at least one letter, one number, and can include special characters',
  // })
  @ApiProperty()
  password: string;
}
