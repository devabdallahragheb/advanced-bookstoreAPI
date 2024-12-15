import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from '../authors.controller';
import { AuthorsService } from '../authors.service';
import { JwtAuthenticationGuard } from '../../common/guards/jwt-authentication.guard';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import PaginationParams from 'src/common/types/pagination-params.type';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockAuthorsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByID: jest.fn(),
  update: jest.fn(),
  deleteOneById: jest.fn(),
};

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mocking the guard
      .compile();

    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get<AuthorsService>(AuthorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createDto: CreateAuthorDto = {
        name: 'John Doe',
        biography: 'An amazing author.',
        birthDate: new Date('1990-01-01'),
      };

      const createdAuthor = {
        id: '123',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockAuthorsService.create.mockResolvedValue(createdAuthor);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(createdAuthor);
    });

    it('should throw error if author already exists', async () => {
      const createDto: CreateAuthorDto = {
        name: 'John Doe',
        biography: 'An amazing author.',
        birthDate: new Date('1990-01-01'),
      };

      mockAuthorsService.create.mockRejectedValue(
        new HttpException('An author with this name already exists', HttpStatus.BAD_REQUEST),
      );

      await expect(controller.create(createDto)).rejects.toThrowError(
        'An author with this name already exists',
      );
    });
  });

  describe('list', () => {
    it('should return a list of authors with count', async () => {
      const paginationParams: PaginationParams = { limit: 10, offset: 0 };

      const authorsList = [
        { id: '123', name: 'Author1', biography: 'Bio1', birthDate: new Date(), createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
        { id: '124', name: 'Author2', biography: 'Bio2', birthDate: new Date(), createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
      ];

      mockAuthorsService.findAll.mockResolvedValue({ count: 2, items: authorsList });

      const result = await controller.list(paginationParams);

      expect(service.findAll).toHaveBeenCalledWith(paginationParams);
      expect(result).toEqual({ count: 2, items: authorsList });
    });
  });

  describe('findByID', () => {
    it('should return an author by ID', async () => {
      const authorId = '123';
      const author = {
        id: authorId,
        name: 'John Doe',
        biography: 'An amazing author.',
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockAuthorsService.findByID.mockResolvedValue(author);

      const result = await controller.findByID(authorId);

      expect(service.findByID).toHaveBeenCalledWith(authorId);
      expect(result).toEqual(author);
    });

    it('should throw error if author is not found', async () => {
      const authorId = '123';
      mockAuthorsService.findByID.mockRejectedValue(
        new HttpException('Author not found.', HttpStatus.NOT_FOUND),
      );

      await expect(controller.findByID(authorId)).rejects.toThrowError('Author not found.');
    });
  });

  describe('update', () => {
    it('should update an author and return the updated author', async () => {
      const authorId = '123';
      const updateDto: UpdateAuthorDto = { biography: 'Updated bio' };

      const updatedAuthor = {
        id: authorId,
        name: 'John Doe',
        biography: 'Updated bio',
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockAuthorsService.update.mockResolvedValue(updatedAuthor);

      const result = await controller.update(authorId, updateDto);

      expect(service.update).toHaveBeenCalledWith(authorId, updateDto);
      expect(result).toEqual(updatedAuthor);
    });

    it('should throw error if author to update is not found', async () => {
      const authorId = '123';
      const updateDto: UpdateAuthorDto = { biography: 'Updated bio' };

      mockAuthorsService.update.mockRejectedValue(
        new HttpException('Author not found.', HttpStatus.NOT_FOUND),
      );

      await expect(controller.update(authorId, updateDto)).rejects.toThrowError('Author not found.');
    });
  });

  describe('delete', () => {
    it('should delete an author by ID', async () => {
      const authorId = '123';

      mockAuthorsService.deleteOneById.mockResolvedValue(undefined);

      await controller.delete(authorId);

      expect(service.deleteOneById).toHaveBeenCalledWith(authorId);
    });

    it('should throw error if author to delete is not found', async () => {
      const authorId = '123';

      mockAuthorsService.deleteOneById.mockRejectedValue(
        new HttpException('Author not found.', HttpStatus.NOT_FOUND),
      );

      await expect(controller.delete(authorId)).rejects.toThrowError('Author not found.');
    });
  });
});
