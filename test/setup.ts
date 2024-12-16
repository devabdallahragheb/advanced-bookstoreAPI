import { mock } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Author } from '../src/authors/entities/authors.entity';
import { Book } from '../src/books/entities/book.entity';
import { Genre } from '../src/genres/entities/genres.entity';
// Mock Repositories
global.authorsRepository = mock<Repository<Author>>();
global.genresRepository = mock<Repository<Genre>>();
global.booksRepository = mock<Repository<Book>>();

// You can also mock the actual methods of these repositories, e.g.
global.authorsRepository.findOne.mockResolvedValue({ id: 1, name: 'Author' });
global.genresRepository.findOne.mockResolvedValue({ id: 1, name: 'Genre' });
global.booksRepository.save.mockResolvedValue({ id: 1, title: 'Book' });
