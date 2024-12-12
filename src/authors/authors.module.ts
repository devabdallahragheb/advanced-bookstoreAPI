import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorsService } from './authors.service';
import Book, { Author } from './entities/authors.entity';
import { AuthorsController } from './authors.controller';

@Module({
  controllers: [AuthorsController],
  exports: [AuthorsService],
  imports: [TypeOrmModule.forFeature([Author]), ConfigModule],
  providers: [AuthorsService],
})
export class AuthorsModule {}
