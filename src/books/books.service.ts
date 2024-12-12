import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import Book from './entities/book.entity';
import CreateBookDto from './dto/create-book.dto';
import UpdateBookDto from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async findAll(query: PaginationParams) {
    const { limit, offset } = query;
    const [items, count] = await this.booksRepository.findAndCount({
      skip: offset,
      take: limit,
      
    });

    return { count, items };
  }

  async create(dto: CreateBookDto) {
    const obj = this.booksRepository.create(dto);
    try {
      await this.booksRepository.save(obj);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Book with that ref number already exists',
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
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author', 'genre'],
    });
    if (!book) {
      throw new HttpException('Book was not found.', HttpStatus.NOT_FOUND);
    }

    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    try {
      const updatedBook = await this.booksRepository.update({ id }, dto);
      const isUpdated = Boolean(updatedBook.affected);

      if (!isUpdated)
        throw new HttpException('Book was not found.', HttpStatus.NOT_FOUND);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Book with that ref number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.booksRepository.findOneBy({ id });
  }

  async deleteOneById(userId: number) {
    await this.booksRepository.softDelete(userId);
  }
}
