import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GenresService } from '../genres.service';
import GenreDto from '../dto/genre.dto';
import { GenresController } from '../genres.controller';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenresService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByID: jest.fn(),
    update: jest.fn(),
    deleteOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  describe('create', () => {
    it('should throw error if genre already exists', async () => {
      const createGenreDto: GenreDto = { name: 'Test Genre', createdBy: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99' };
  
      // Mocking the service to throw the expected HttpException
      mockGenresService.create.mockRejectedValue(
        new HttpException('A genre with this name already exists', HttpStatus.BAD_REQUEST)
      );
  
      // Mocking the request object
      const mockRequest = { user: { id: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99' } };
  
      try {
        await controller.create(createGenreDto, mockRequest);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe('A genre with this name already exists');
      }
    });
  });
  
  describe('list', () => {
    it('should return all genres', async () => {
      const paginationParams = { limit: 10, offset: 0 };
      const genres = [
        { id: '1', name: 'Genre 1' },
        { id: '2', name: 'Genre 2' },
      ];
      const count = 2;
      mockGenresService.findAll.mockResolvedValue({ items: genres, count });

      const result = await controller.list(paginationParams);

      expect(result).toEqual({ items: genres, count });
      expect(mockGenresService.findAll).toHaveBeenCalledWith(paginationParams);
    });
  });

  describe('findByID', () => {
    it('should return a genre by id', async () => {
      const genre = { id: '1', name: 'Test Genre' };
      mockGenresService.findByID.mockResolvedValue(genre);

      const result = await controller.findByID('1');

      expect(result).toEqual(genre);
      expect(mockGenresService.findByID).toHaveBeenCalledWith('1');
    });

    it('should throw error if genre not found', async () => {
      mockGenresService.findByID.mockRejectedValue(
        new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      );

      try {
        await controller.findByID('non-existent-id');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe('Genre not found');
      }
    });
  });

  describe('update', () => {
    it('should update the genre', async () => {
      const updateGenreDto: GenreDto = { name: 'Updated Genre',createdBy:'cb1e5729-0293-4605-83ae-b2cfac8c2b99' };
      const updatedGenre = { ...updateGenreDto, id: '1' };
      mockGenresService.update.mockResolvedValue(updatedGenre);

      const result = await controller.update('1', updateGenreDto);

      expect(result).toEqual(updatedGenre);
      expect(mockGenresService.update).toHaveBeenCalledWith('1', updateGenreDto);
    });

    it('should throw error if genre not found during update', async () => {
      const updateGenreDto: GenreDto = { name: 'Updated Genre',createdBy:'cb1e5729-0293-4605-83ae-b2cfac8c2b99'};
      mockGenresService.update.mockRejectedValue(
        new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      );

      try {
        await controller.update('non-existent-id', updateGenreDto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe('Genre not found');
      }
    });
  });

  describe('delete', () => {
    it('should delete a genre', async () => {
      mockGenresService.deleteOneById.mockResolvedValue(undefined);

      await controller.delete('1');

      expect(mockGenresService.deleteOneById).toHaveBeenCalledWith('1');
    });

    it('should throw error if genre not found during delete', async () => {
      mockGenresService.deleteOneById.mockRejectedValue(
        new HttpException('Genre not found', HttpStatus.NOT_FOUND)
      );

      try {
        await controller.delete('non-existent-id');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(e.message).toBe('Genre not found');
      }
    });
  });
});
