import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Genre from '../entities/genres.entity';
import { GenresService } from '../genres.service';
import GenreDto from '../dto/genre.dto';
import ERROR_MESSAGES from 'src/common/enums/error.messgaes';

describe('GenresService', () => {
  let service: GenresService;
  let repository: Repository<Genre>;

  const mockGenreRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    softDelete: jest.fn(),
  };

  const genreDto: GenreDto = { name: 'Test Genre' ,createdBy:'cb1e5729-0293-4605-83ae-b2cfac8c2b99'};
  const genre = { id: '1', name: 'Test Genre' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    repository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
  });

  describe('create', () => {
    it('should create a genre successfully', async () => {
      mockGenreRepository.findOne.mockResolvedValue(null); // No genre with the same name
      mockGenreRepository.save.mockResolvedValue({ ...genreDto, id: '1' });

      const result = await service.create(genreDto,'cb1e5729-0293-4605-83ae-b2cfac8c2b99');

      expect(result).toEqual({ ...genreDto, id: '1' });
      expect(mockGenreRepository.save).toHaveBeenCalled();
    });

    it('should throw error if genre already exists', async () => {
      mockGenreRepository.findOne.mockResolvedValue({ name: 'Test Genre' });

      await expect(service.create(genreDto,"'cb1e5729-0293-4605-83ae-b2cfac8c2b99'")).rejects.toThrowError(new HttpException('A genre with this name already exists', HttpStatus.BAD_REQUEST));
    });

    it('should throw error if something goes wrong during creation', async () => {
      mockGenreRepository.findOne.mockResolvedValue(null);
      mockGenreRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(genreDto,'cb1e5729-0293-4605-83ae-b2cfac8c2b99')).rejects.toThrowError(new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('findByID', () => {
    it('should return a genre by ID', async () => {
      mockGenreRepository.findOneBy.mockResolvedValue(genre);

      const result = await service.findByID('1');

      expect(result).toEqual(genre);
      expect(mockGenreRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw error if genre not found by ID', async () => {
      mockGenreRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findByID('1')).rejects.toThrowError(new HttpException('Genre not found.', HttpStatus.NOT_FOUND));
    });
  });

  describe('update', () => {
    it('should update and return the genre', async () => {
      const updatedGenre = { ...genre, name: 'Updated Genre', createdBy: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99' };
      mockGenreRepository.preload.mockResolvedValue(updatedGenre);
      mockGenreRepository.save.mockResolvedValue(updatedGenre);
    
      const result = await service.update('1', { name: 'Updated Genre', createdBy: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99' });
    
      expect(result).toEqual(updatedGenre);
      expect(mockGenreRepository.preload).toHaveBeenCalledWith({ id: '1', name: 'Updated Genre', createdBy: 'cb1e5729-0293-4605-83ae-b2cfac8c2b99' });
      expect(mockGenreRepository.save).toHaveBeenCalled();
    });
    

    it('should throw error if genre not found during update', async () => {
      mockGenreRepository.preload.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated Genre' })).rejects.toThrowError(new HttpException('Genre not found.', HttpStatus.NOT_FOUND));
    });

    it('should throw error if something goes wrong during update', async () => {
      mockGenreRepository.preload.mockResolvedValue(genre);
      mockGenreRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.update('1', { name: 'Updated Genre' ,createdBy:'cb1e5729-0293-4605-83ae-b2cfac8c2b99'})).rejects.toThrowError(new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('deleteOneById', () => {
    it('should delete a genre by ID successfully', async () => {
      mockGenreRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.deleteOneById('1');

      expect(mockGenreRepository.softDelete).toHaveBeenCalledWith('1');
    });

    it('should throw 404 error if genre not found during delete', async () => {
      mockGenreRepository.softDelete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteOneById('nonexistent-id')).rejects.toThrowError(new HttpException('Genre not found.', HttpStatus.NOT_FOUND));
    });

    it('should throw 500 error if something goes wrong during delete', async () => {
      mockGenreRepository.softDelete.mockResolvedValue({ affected: -1 });

      await expect(service.deleteOneById('1')).rejects.toThrowError(new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });
});
