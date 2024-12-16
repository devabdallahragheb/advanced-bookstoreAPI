import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {  GenresController } from './genres.controller';
import Book, { Genre } from './entities/genres.entity';
import { GenresService } from './genres.service';

@Module({
  controllers: [GenresController],
  exports: [GenresService,TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Genre]), ConfigModule],
  providers: [GenresService],
})
export class GenresModule {}
