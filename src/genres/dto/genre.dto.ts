import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class  GenreDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'drama', description: 'the genre name' })
  name?: string;
 
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99',
    description: 'The UUID of the user which creat genre',
  })
  createdBy?: string;
}

export default GenreDto;
