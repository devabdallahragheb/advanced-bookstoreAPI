import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Intro to Js', description: 'the book name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Intro to Js', description: 'the book name' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Intro to Js description',
    description: 'the book description',
  })
  description: string;

  @IsOptional()
  @Type(() => Date)  
  @IsDate()
  @ApiProperty({
    example: '1990-01-20T00:00:00.000Z',  
    description: 'the publicationDate of this book is  ',
  })
  publicationDate: Date;

  @IsUUID()
  @IsOptional()
  authorId: number;

  @IsUUID()
  @IsOptional()
  genreId: number;
}

export default UpdateBookDto;
