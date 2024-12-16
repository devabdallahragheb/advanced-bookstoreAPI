import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import Author from '../entities/authors.entity';
import { AuthorsService } from '../authors.service';
import CreateAuthorDto from '../dto/create-author.dto';
import UpdateAuthorDto from '../dto/update-author.dto';
import AUTHORS_ERROR_MESSAGES from '../enums/authors.error';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repository: Repository<Author>;

  const mockAuthorRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockAuthor = {
    name: 'Abdullah Abdelglil',
    biography: 'Author from Alexandria with many certificates.',
    birthDate: new Date('1990-01-20'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    repository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return a list of authors with pagination', async () => {
      const paginationParams = { limit: 10, offset: 0 };
      const mockAuthors = [mockAuthor];
      mockAuthorRepository.findAndCount.mockResolvedValue([mockAuthors, 1]);

      const result = await service.findAll(paginationParams);
      expect(result.count).toBe(1);
      expect(result.items).toEqual(mockAuthors);
    });
  });

  describe('create', () => {
    it('should successfully create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'Abdullah Abdelglil',
        biography: 'Author from Alexandria with many certificates.',
        birthDate: new Date('1990-01-20')
        ,createdBy:"cb1e5729-0293-4605-83ae-b2cfac8c2b99"
        
      };
      mockAuthorRepository.findOne.mockResolvedValue(null);
      mockAuthorRepository.create.mockReturnValue(mockAuthor);
      mockAuthorRepository.save.mockResolvedValue(mockAuthor);

      const result = await service.create(createAuthorDto,"'cb1e5729-0293-4605-83ae-b2cfac8c2b99'");

      expect(result).toEqual(mockAuthor);
      expect(mockAuthorRepository.save).toHaveBeenCalledWith(mockAuthor);
    });

    it('should throw an error if the author already exists', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'Abdullah Abdelglil',
        biography: 'Author from Alexandria with many certificates.',
        birthDate: new Date('1990-01-20'),
        createdBy:'cb1e5729-0293-4605-83ae-b2cfac8c2b99'
      };
      mockAuthorRepository.findOne.mockResolvedValue(mockAuthor);
    
      await expect(service.create(createAuthorDto,'cb1e5729-0293-4605-83ae-b2cfac8c2b99')).rejects.toThrowError(
        new HttpException(
          AUTHORS_ERROR_MESSAGES.AUTHORS_ALREADY_EXISTS,  // Match the message in your constant
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    
  });

  describe('findByID', () => {
    it('should return the author by ID', async () => {
      mockAuthorRepository.findOneBy.mockResolvedValue(mockAuthor);

      const result = await service.findByID('1');
      expect(result).toEqual(mockAuthor);
    });

    it('should throw an error if the author is not found', async () => {
      mockAuthorRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findByID('1')).rejects.toThrowError(
        new HttpException('Author not found.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update an existing author', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Updated Author' };
      mockAuthorRepository.preload.mockResolvedValue(mockAuthor);
      mockAuthorRepository.save.mockResolvedValue(mockAuthor);

      const result = await service.update('1', updateAuthorDto);
      expect(result).toEqual(mockAuthor);
      expect(mockAuthorRepository.save).toHaveBeenCalledWith(mockAuthor);
    });

    it('should throw an error if the author to update is not found', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Updated Author' };
      mockAuthorRepository.preload.mockResolvedValue(null);

      await expect(service.update('1', updateAuthorDto)).rejects.toThrowError(
        new HttpException('Author not found.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteOneById', () => {
    it('should delete an author by ID', async () => {
      mockAuthorRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.deleteOneById('1');
      expect(mockAuthorRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if the author to delete is not found', async () => {
      mockAuthorRepository.softDelete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteOneById('1')).rejects.toThrowError(
        new HttpException('Author not found.', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('handleDatabaseError', () => {
    it('should throw an error for unique violation', () => {
      const error = { code: '23505' }; // Postgres unique violation code
      expect(() => service['handleDatabaseError'](error)).toThrowError(
        new HttpException(
          AUTHORS_ERROR_MESSAGES.UNIQUE_VIOLATION,  // Match the message in your constant
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    

    it('should throw an unexpected error', () => {
      const error = new Error('Unexpected error');
      expect(() => service['handleDatabaseError'](error)).toThrowError(
        new HttpException(
          'An unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
