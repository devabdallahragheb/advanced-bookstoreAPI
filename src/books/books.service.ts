import { Cache } from '@nestjs/cache-manager';  // Corrected import for cache-manager
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Book from './entities/book.entity';
import CreateBookDto from './dto/create-book.dto';
import UpdateBookDto from './dto/update-book.dto';
import Genre from 'src/genres/entities/genres.entity';
import Author from 'src/authors/entities/authors.entity';
import PaginationParams from 'src/common/types/pagination-params.type';
import ERROR_MESSAGES from 'src/common/enums/error.messgaes';
import BOOK_ERROR_MESSAGES from './enums/books.error';
import GENRE_ERROR_MESSAGES from 'src/genres/enums/genres.error';
import AUTHORS_ERROR_MESSAGES from 'src/authors/enums/authors.error';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Genre)
    private readonly genresRepository: Repository<Genre>,
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
    @Inject(Cache) private readonly cacheManager: Cache,   
  ) {}

  async findAll({ limit, offset }: PaginationParams) {
    const cacheKey = `books-list:${offset}:${limit}`;
    
    const cachedBooks = await this.cacheManager.get(cacheKey);

    if (cachedBooks) {
      return cachedBooks;
    }

    const [items, count] = await this.booksRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    const result = { count, items };
    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async findByID(id: string) {
    const cacheKey = `book:${id}`;
    const cachedBook = await this.cacheManager.get(cacheKey);

    if (cachedBook) {
      return cachedBook;
    }

    try {
      const book = await this.booksRepository.findOneOrFail({
        where: { id },
        relations: ['author', 'genre'],
      });

      await this.cacheManager.set(cacheKey, book);
      return book;
    } catch (error) {
      // Return null if book is not found
      return null;
    }
  }

  async create(dto: CreateBookDto) {
    const { authorId, genreId } = dto;

    const [author, genre] = await this.validateAuthorAndGenre(authorId, genreId);

    const newBook = this.booksRepository.create({ ...dto, author, genre });

    try {
      await this.booksRepository.save(newBook);
      await this.invalidateCache();  // Invalidate cache after creating a book
      return newBook;
    } catch (error) {
      throw new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, dto: UpdateBookDto) {
    const existingBook = await this.findByID(id);

    if (!existingBook) {
      throw new HttpException(BOOK_ERROR_MESSAGES.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Now we can safely spread the existingBook object and the dto
    const updatedBook = Object.assign({}, existingBook, dto);

    try {
      await this.booksRepository.save(updatedBook);
      await this.invalidateCache();  // Invalidate cache after updating a book
      return updatedBook;
    } catch (error) {
      throw new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteOneById(bookId: string) {
    const result = await this.booksRepository.softDelete(bookId);

    if (result.affected === 0) {
      throw new HttpException(BOOK_ERROR_MESSAGES.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this.invalidateCache();  // Invalidate cache after deleting a book
  }

  private async invalidateCache() {
    // Invalidate the cache for both book list and individual books
    await this.cacheManager.del('books-list:*');  // Delete cached book list
    await this.cacheManager.del('book:*');  // Delete cached individual book details
  }

  private async validateAuthorAndGenre(authorId: string, genreId: string): Promise<[Author, Genre]> {
    const [author, genre] = await Promise.all([
      this.authorsRepository.findOne({ where: { id: authorId } }),
      this.genresRepository.findOne({ where: { id: genreId } }),
    ]);

    if (!author) {
      throw new HttpException(AUTHORS_ERROR_MESSAGES.AUTHORS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (!genre) {
      throw new HttpException(GENRE_ERROR_MESSAGES.GENRE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return [author, genre];
  }
}
