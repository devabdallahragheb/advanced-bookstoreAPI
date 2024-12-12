import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class  GenreDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'drama', description: 'the genre name' })
  name: string;
}
export default GenreDto;
