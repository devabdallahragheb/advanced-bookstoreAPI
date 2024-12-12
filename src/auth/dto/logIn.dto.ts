import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LogInDto {
  @IsEmail()
  @ApiProperty({ example: 'aabdelglil4@gmail.com', description: 'user email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: '123456789', description: 'user password' })
  password: string;
}

export default LogInDto;
