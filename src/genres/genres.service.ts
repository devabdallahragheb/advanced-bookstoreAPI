import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import { Genre } from './entities/genres.entity';
import GenreDto from './dto/genre.dto';
import GENRE_ERROR_MESSAGES from './enums/genres.error';
import ERROR_MESSAGES from 'src/common/enums/error.messgaes';

// Constants for error messages to ensure consistency

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

  private async checkIfGenreExists(name: string) {
    const existingGenre = await this.genresRepository.findOne({ where: { name } });
    if (existingGenre) {
      throw new HttpException(GENRE_ERROR_MESSAGES.GENRE_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }
  }

  async create(dto: GenreDto) {
    await this.checkIfGenreExists(dto.name); // Check if genre name exists

    const genre = this.genresRepository.create(dto);
    return this.saveGenre(genre);
  }

  async findByID(id: string): Promise<Genre> {
    const genre = await this.genresRepository.findOneBy({ id });
    if (!genre) {
      throw new HttpException(GENRE_ERROR_MESSAGES.GENRE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return genre;
  }

  async update(id: string, dto: GenreDto): Promise<Genre> {
    const genre = await this.genresRepository.preload({ id, ...dto });
    if (!genre) {
      throw new HttpException(GENRE_ERROR_MESSAGES.GENRE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return this.saveGenre(genre);
  }

  async deleteOneById(id: string): Promise<void> {
    const result = await this.genresRepository.softDelete(id);

    if (result.affected === 0) {
      throw new HttpException(GENRE_ERROR_MESSAGES.GENRE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (result.affected < 0) {
      throw new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async saveGenre(genre: Genre): Promise<Genre> {
    try {
      return await this.genresRepository.save(genre);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: any) {
    // Handle unique constraint violations specifically
    if (error?.code === PostgresErrorCode.UniqueViolation) {
      throw new HttpException(GENRE_ERROR_MESSAGES.UNIQUE_VIOLATION, HttpStatus.BAD_REQUEST);
    }

    // General database error handling
    throw new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
