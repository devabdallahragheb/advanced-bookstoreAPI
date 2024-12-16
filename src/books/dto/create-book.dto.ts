import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @ApiProperty({ example: 'Intro to Js', description: 'The title of the book' })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'Intro to JS description',
    description: 'A brief description of the book',
  })
  description: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '1990-01-20T00:00:00.000Z',
    description: 'The publication date of the book',
  })
  publicationDate: Date;

  @IsUUID()
  @ApiProperty({
    example: '3d27f23b-58a6-42b1-8e75-86d37eab7e38',
    description: 'The UUID of the author associated with the book',
  })
  authorId: string;

  @IsUUID()
  @ApiProperty({
    example: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99',
    description: 'The UUID of the genre associated with the book',
  })
  genreId: string;
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99',
    description: 'The UUID of the user which create book',
  })
  createdBy?: string;
}

export default CreateBookDto;
