import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import  { Author } from './entities/authors.entity';
import  { CreateAuthorDto } from './dto/create-author.dto';
import   { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async findAll(query: PaginationParams) {
    const { limit, offset } = query;
    const [items, count] = await this.authorsRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return { count, items };
  }

  async create(dto: CreateAuthorDto) {
    const obj = this.authorsRepository.create(dto);
    try {
      await this.authorsRepository.save(obj);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'author with that ref number already exists',
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
    const author = await this.authorsRepository.findOneBy({ id });
    if (!author) {
      throw new HttpException('author was not found.', HttpStatus.NOT_FOUND);
    }

    return author;
  }

  async update(id: string, dto: UpdateAuthorDto) {
    try {
      const updatedAuthor = await this.authorsRepository.update({ id }, dto);
      const isUpdated = Boolean(updatedAuthor.affected);

      if (!isUpdated)
        throw new HttpException('Author was not found.', HttpStatus.NOT_FOUND);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Author with that ref number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.authorsRepository.findOneBy({ id });
  }

  async deleteOneById(userId: number) {
    await this.authorsRepository.softDelete(userId);
  }
}
