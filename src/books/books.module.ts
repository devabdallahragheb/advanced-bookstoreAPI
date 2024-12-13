import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import Book from './entities/book.entity';
import { GenresModule } from 'src/genres/genres.module';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  controllers: [BooksController],
  exports: [BooksService],
  imports: [TypeOrmModule.forFeature([Book]), ConfigModule,GenresModule,AuthorsModule],
  providers: [BooksService],
})
export class BooksModule {}
