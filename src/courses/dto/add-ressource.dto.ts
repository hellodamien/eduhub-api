import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddRessourceDto {
  @IsString()
  @ApiProperty()
  title: string;
}
