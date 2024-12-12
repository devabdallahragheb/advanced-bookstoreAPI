import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @ApiProperty({ example: 'Intro to Js', description: 'the book name' })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'Intro to Js description',
    description: 'the book description',
  })
  description: string;
  @Type(() => Date)  
  @IsDate()
  @ApiProperty({
    example: '1990-01-20T00:00:00.000Z',  
    description: 'the publicationDate of this book is  ',
  })
  publicationDate: Date;
  @IsUUID()
  authorId: string;

  @IsUUID()
  genreId: string;
}

export default CreateBookDto;
