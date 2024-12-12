import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import Book from './entities/book.entity';

@Module({
  controllers: [BooksController],
  exports: [BooksService],
  imports: [TypeOrmModule.forFeature([Book]), ConfigModule],
  providers: [BooksService],
})
export class BooksModule {}
