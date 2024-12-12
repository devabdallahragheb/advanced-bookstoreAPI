import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import   { Genre } from './entities/genres.entity';
import GenreDto from './dto/genre.dto';
 

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
  ) {}

  async findAll(query: PaginationParams) {
    const { limit, offset } = query;
    const [items, count] = await this.genresRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return { count, items };
  }

  async create(dto: GenreDto) {
    const obj = this.genresRepository.create(dto);
    try {
      await this.genresRepository.save(obj);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'genre with that ref number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return obj;
  }

  async find(id: string) {
    const genre = await this.genresRepository.findOneBy({ id });
    if (!genre) {
      throw new HttpException('genre was not found.', HttpStatus.NOT_FOUND);
    }

    return genre;
  }

  async update(id: string, dto: GenreDto) {
    try {
      const updatedGenre= await this.genresRepository.update({ id }, dto);
      const isUpdated = Boolean(updatedGenre.affected);

      if (!isUpdated)
        throw new HttpException('genre was not found.', HttpStatus.NOT_FOUND);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'genre with that ref number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.genresRepository.findOneBy({ id });
  }

  async deleteOneById(userId: number) {
    await this.genresRepository.softDelete(userId);
  }
}
