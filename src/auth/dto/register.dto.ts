import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abdullah', description: 'user first name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'abdelglil', description: 'user last name' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'aabdelglil4@gmail.com', description: 'user email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: '123456789', description: 'user password' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'alexandria, egypt', description: 'user address' })
  address: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '+201121512668', description: 'user phone' })
  phone: string;
}

export default RegisterDto;
