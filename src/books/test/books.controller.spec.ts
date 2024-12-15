import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByID: jest.fn(),
    deleteOneById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a book and return it', async () => {
      const createBookDto = { 
        title: 'New Book', 
        description: 'A new test book', 
        publicationDate: new Date(), 
        authorId: 'author-id', 
        genreId: 'genre-id', 
      createdBy: "cb1e5729-0293-4605-83ae-b2cfac8c2b99"
      };
    
      mockBooksService.create.mockResolvedValue(createBookDto);
      
      const mockRequest = { user: { id: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99' } };  // Set the mock request with user ID
      const result = await controller.create(createBookDto, mockRequest);  // Pass mockRequest as the second argument
      
      expect(result).toEqual(createBookDto);
  
      
    });
  });
  
  describe('list', () => {
    it('should return a list of books', async () => {
      const paginationParams = { offset: 0, limit: 10 };
      const books = [
        {
          id: '1',
          title: 'Test Book',
          description: 'Test description',
          publicationDate: new Date(),
        },
      ];

      mockBooksService.findAll.mockResolvedValue({ items: books, count: books.length });

      // Type assertion to specify the expected structure
      const result = (await controller.list(paginationParams)) as {
        items: typeof books;
        count: number;
      };

      expect(result.items).toEqual(books);
      expect(result.count).toEqual(books.length);
      expect(mockBooksService.findAll).toHaveBeenCalledWith(paginationParams);
    });
  });

  describe('findByID', () => {
    it('should return a book by id', async () => {
      const bookId = '1';
      const foundBook = { id: '1', title: 'Test Book', description: 'Test description', publicationDate: new Date() };
      
      mockBooksService.findByID.mockResolvedValue(foundBook);

      const result = await controller.findByID(bookId);
      expect(result).toEqual(foundBook);
      expect(mockBooksService.findByID).toHaveBeenCalledWith(bookId);
    });

    it('should throw an error if book is not found', async () => {
      const bookId = 'non-existing-id';
      mockBooksService.findByID.mockRejectedValue(new HttpException('Book not found', HttpStatus.NOT_FOUND));

      await expect(controller.findByID(bookId)).rejects.toThrowError(new HttpException('Book not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('update', () => {
    it('should update a book and return the updated book', async () => {
      const updateBookDto = { title: 'Updated Book', description: 'Updated test book', publicationDate: new Date(), authorId: 'author-id', genreId: 'genre-id' };
      const updatedBook = { id: '1', ...updateBookDto };

      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update('1', updateBookDto);
      expect(result).toEqual(updatedBook);
      expect(mockBooksService.update).toHaveBeenCalledWith('1', updateBookDto);
    });
  });

  describe('delete', () => {
    it('should delete a book by id', async () => {
      const bookId = '1';
      mockBooksService.deleteOneById.mockResolvedValue({ affected: 1 });

      await controller.delete(bookId);
      expect(mockBooksService.deleteOneById).toHaveBeenCalledWith(bookId);
    });

    it('should throw an error if delete fails', async () => {
      const bookId = '1';
      mockBooksService.deleteOneById.mockRejectedValue(new HttpException('Book not found', HttpStatus.NOT_FOUND));

      await expect(controller.delete(bookId)).rejects.toThrowError(new HttpException('Book not found', HttpStatus.NOT_FOUND));
    });
  });
});
