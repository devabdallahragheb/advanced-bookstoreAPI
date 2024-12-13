import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import Book from './entities/book.entity';
import CreateBookDto from './dto/create-book.dto';
import UpdateBookDto from './dto/update-book.dto';
import Genre from 'src/genres/entities/genres.entity';
import Author from 'src/authors/entities/authors.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
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
    const { authorId, genreId } = dto;
    // Fetch the book along with its related author and genre in a single query
    const book = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.genre', 'genre')
      .where('author.id = :authorId', { authorId })
      .andWhere('genre.id = :genreId', { genreId })
      .getOne();

    // If book already exists (or if no book is found), handle the error
    if (book) {
      throw new HttpException(
        'Book with that reference number already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // If no book found, proceed with creating a new one
    const author = await this.authorsRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new HttpException(`Author with id ${authorId} not found`, HttpStatus.NOT_FOUND);
    }

    const genre = await this.genresRepository.findOne({ where: { id: genreId } });
    if (!genre) {
      throw new HttpException(`Genre with id ${genreId} not found`, HttpStatus.NOT_FOUND);
    }

    const newBook = this.booksRepository.create({ ...dto, author, genre });

    try {
      await this.booksRepository.save(newBook);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'Book with that reference number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return newBook;
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
