import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @ApiProperty({ example: 'abdullah abdelglil', description: 'the auther  name' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'this auther from alex and have alot of certificate ', description: 'the auther biography' })
  biography: string;
  
  @IsDate()
  @Type(() => Date)  
  @ApiProperty({
    example: '1990-01-20T00:00:00.000Z',  
    description: 'The birth date of the author',
  })
  birthDate: Date;
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99',
    description: 'The UUID of the user which create author',
  })
  createdBy?: string;
}

export default CreateAuthorDto;
