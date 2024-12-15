import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import { Author } from './entities/authors.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import Authors_ERROR_MESSAGES, { AUTHORS_ERROR_MESSAGES } from './enums/authors.error';
import ERROR_MESSAGES from 'src/common/enums/error.messgaes';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  // Fetch all authors with pagination
  async findAll(query: PaginationParams) {
    const { limit, offset } = query;

    const [items, count] = await this.authorsRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return { count, items };
  }

  // Create a new author
  async create(dto: CreateAuthorDto) {
    await this.ensureAuthorDoesNotExist(dto.name);

    const author = this.authorsRepository.create(dto);
    try {
      await this.authorsRepository.save(author);
      return author;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // Find author by ID
  async findByID(id: string) {
    const author = await this.authorsRepository.findOneBy({ id });
    if (!author) {
      throw new HttpException(Authors_ERROR_MESSAGES.AUTHORS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return author;
  }

  // Update author details
  async update(id: string, dto: UpdateAuthorDto) {
    const author = await this.authorsRepository.preload({
      id,
      ...dto,
    });

    if (!author) {
      throw new HttpException(Authors_ERROR_MESSAGES.AUTHORS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.saveAuthor(author);
  }

  // Soft delete author by ID
  async deleteOneById(authorId: string) {
    const result = await this.authorsRepository.softDelete(authorId);

    if (!result.affected) {
      throw new HttpException(AUTHORS_ERROR_MESSAGES.AUTHORS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  // Ensure an author with a given name doesn't already exist
  private async ensureAuthorDoesNotExist(name: string) {
    const existingAuthor = await this.authorsRepository.findOne({
      where: { name },
    });

    if (existingAuthor) {
      throw new HttpException(AUTHORS_ERROR_MESSAGES.AUTHORS_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }
  }

  // Save an author and handle any database errors
  private async saveAuthor(author: Author) {
    try {
      return await this.authorsRepository.save(author);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // Handle common database errors
  private handleDatabaseError(error: any) {
    if (error?.code === PostgresErrorCode.UniqueViolation) {
      throw new HttpException(AUTHORS_ERROR_MESSAGES.UNIQUE_VIOLATION, HttpStatus.BAD_REQUEST);
    }
    throw new HttpException(ERROR_MESSAGES.UNEXPECTED_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
