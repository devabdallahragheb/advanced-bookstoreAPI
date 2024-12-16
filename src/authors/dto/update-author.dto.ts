import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateAuthorDto {
 
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'abdullah abdelglil', description: 'the auther  name' })
  name?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'this auther from alex and have alot of certificate ', description: 'the auther biography' })
  biography?: string;

  @IsOptional()
  @Type(() => Date)  
  @IsDate()
  @ApiProperty({
    example: '1990-01-20T00:00:00.000Z',  
    description: 'the birthDate of author 1990-01-20  ',
  })
  birthDate?: Date;
}

export default UpdateAuthorDto;
