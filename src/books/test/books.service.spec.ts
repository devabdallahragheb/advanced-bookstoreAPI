import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from '../books.service';
import Book from '../entities/book.entity';
import Genre from 'src/genres/entities/genres.entity';
import Author from 'src/authors/entities/authors.entity';
import { Queue } from 'bull';  // Import Queue from bull
import { InjectQueue } from '@nestjs/bull';

// Mock for BullQueue_notifications
const mockBullQueue = {
  add: jest.fn(), // Mock the add method that queues notifications
  on: jest.fn(),
  process: jest.fn(),
};

describe('BooksService with Caching', () => {
  let service: BooksService;
  let booksRepository: Repository<Book>;
  let cacheManager: Cache;

  const mockBooksRepository = {
    findAndCount: jest.fn(),
    findOneOrFail: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    softDelete: jest.fn(),
  };
  const mockAuthorsRepository = {
    findOne: jest.fn(), // Mock the findOne method for authors
  };
  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
  const mockGenresRepository = {
    findOne: jest.fn(), // Mock the findOne method for genres
  };
  const books = [
    { id: '1', title: 'Book 1', genre: {}, author: {} },
    { id: '2', title: 'Book 2', genre: {}, author: {} },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBooksRepository,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Author),
          useValue: {},
        },
        {
          provide: Cache,
          useValue: mockCacheManager,
        },
        {
          provide: 'BullQueue_notifications',  // Mock the Bull queue provider
          useValue: mockBullQueue,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    cacheManager = module.get<Cache>(Cache);
  });

  describe('findAll', () => {
    it('should return books from cache if available', async () => {
      const cachedResult = { items: books, count: books.length };

      mockCacheManager.get.mockResolvedValue(cachedResult);

      const result = (await service.findAll({ limit: 10, offset: 0 })) as {
        items: Book[];
        count: number;
      };

      expect(result.items).toEqual(books);
      expect(result.count).toEqual(books.length);
    });

    it('should fetch books from the database if cache is empty', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockBooksRepository.findAndCount.mockResolvedValue([books, books.length]);

      const result = (await service.findAll({ limit: 10, offset: 0 })) as {
        items: Book[];
        count: number;
      };

      expect(result.items).toEqual(books);
      expect(result.count).toEqual(books.length);
      expect(mockCacheManager.set).toHaveBeenCalledWith('books-list:0:10', {
        items: books,
        count: books.length,
      });
    });
  });

  // describe('create', () => {
  //   it('should create a new book and add a notification to the queue', async () => {
  //     const createBookDto = { title: 'New Book', authorId: '1', genreId: '1', description: 'abdullah cv', publicationDate: new Date() };
  //     const createdBy = 'user1';

  //     // Mock the responses for the repositories
  //     mockAuthorsRepository.findOne.mockResolvedValue({ id: '1', name: 'Author Name' });
  //     mockGenresRepository.findOne.mockResolvedValue({ id: '1', name: 'Genre Name' });

  //     mockBooksRepository.create.mockReturnValue({ ...createBookDto, createdBy });
  //     mockBooksRepository.save.mockResolvedValue({ ...createBookDto, createdBy });

  //     const result = await service.create(createBookDto, createdBy);

  //     expect(result.title).toEqual(createBookDto.title);
  //     expect(mockBullQueue.add).toHaveBeenCalledWith('sendNotification', {
  //       bookTitle: result.title,
  //       userId: createdBy,
  //     });
  //     expect(mockCacheManager.del).toHaveBeenCalled();  // Ensure cache invalidation
  //   });
  // });
  describe('findByID', () => {
    it('should return a book from cache if available', async () => {
      mockCacheManager.get.mockResolvedValue(books[0]);

      const result = await service.findByID('1');

      expect(result).toEqual(books[0]);
      expect(mockCacheManager.get).toHaveBeenCalledWith('book:1');
      expect(mockBooksRepository.findOneOrFail).not.toHaveBeenCalled();
    });

    it('should fetch a book from the database if cache is empty', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockBooksRepository.findOneOrFail.mockResolvedValue(books[0]);

      const result = await service.findByID('1');

      expect(result).toEqual(books[0]);
      expect(mockCacheManager.set).toHaveBeenCalledWith('book:1', books[0]);
    });
  });

  describe('invalidateCache', () => {
    it('should invalidate cache when called', async () => {
      await service['invalidateCache']();

      expect(mockCacheManager.del).toHaveBeenCalledWith('books-list:*');
      expect(mockCacheManager.del).toHaveBeenCalledWith('book:*');
    });
  });
});
