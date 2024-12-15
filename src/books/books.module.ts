import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import Book from './entities/book.entity';
import { GenresModule } from 'src/genres/genres.module';
import { AuthorsModule } from 'src/authors/authors.module';
import Genre from 'src/genres/entities/genres.entity';
import Author from 'src/authors/entities/authors.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { NotificationsModule } from 'src/notification/notifications.module';
// import { NotificationsModule } from 'src/notification/notifications.module';

@Module({
  controllers: [BooksController],
  exports: [BooksService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([Book, Genre, Author]), // Include Genre and Author entities here
    ConfigModule,
    GenresModule,
    AuthorsModule,
    CacheModule.register(), 
    NotificationsModule,
  ],
  providers: [BooksService],
})
export class BooksModule {}
