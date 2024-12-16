import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GenresController } from '../genres.controller';
import { GenresService } from '../genres.service';
import Genre from '../entities/genres.entity';
import Book from '../../books/entities/book.entity';
import Author from '../../authors/entities/authors.entity';
import GenreDto from '../dto/genre.dto';
import { JwtAuthenticationGuard } from '../../common/guards/jwt-authentication.guard';
// vip we have a multi way to use integration test  but in this app i use the same db   but it's not good way  i use it for save  time only i prefed to use In-memory databases

jest.mock('../../common/guards/jwt-authentication.guard', () => ({
  JwtAuthenticationGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockResolvedValue(true), // Always allow in the test
  })),
}));

describe('GenresController (e2e)', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    jest.setTimeout(30000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'admin',
          password: 'password',
          database: 'db_bookstore',
          entities: [Genre, Book, Author],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Genre, Book, Author]),
      ],
      controllers: [GenresController],
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: {
            create: jest.fn().mockImplementation((dto: GenreDto) => {
              return { id: '2', name: dto.name };
            }),
            save: jest.fn().mockImplementation((genre) => genre),
            findOne: jest.fn().mockResolvedValue(null),
            findOneBy: jest.fn().mockImplementation(({ id }) => {
              if (id === '1') return { id: '1', name: 'Comedy' };
              return null;
            }),
            find: jest.fn().mockResolvedValue([{ id: '1', name: 'Comedy' }]),
            findAndCount: jest.fn().mockResolvedValue([
              [{ id: '1', name: 'Comedy' }],
              1,
            ]),
            preload: jest.fn().mockImplementation((dto) => {
              if (dto.id === '999') return null; // Simulate non-existent genre
              return { id: dto.id, ...dto }; // Simulate existing genre
            }),
            
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            softDelete: jest.fn().mockImplementation((id) => {
              if (id === '1') {
                return { affected: 1 }; // Simulate successful soft delete
              }
              return { affected: 0 }; // Simulate not found
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    const jwtService = app.get(JwtService);
    token = jwtService.sign(
      { userId: 1, username: 'testuser' },
      { secret: 'test-secret', expiresIn: '60s' },
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a genre (POST /genres)', async () => {
    const genreDto: GenreDto = { name: 'Comedy' };

    const response = await request(app.getHttpServer())
      .post('/genres')
      .set('Authorization', `Bearer ${token}`)
      .send(genreDto);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Comedy');
  });

  it('should get a genre by ID (GET /genres/:id)', async () => {
    const response = await request(app.getHttpServer())
      .get('/genres/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('1');
    expect(response.body.name).toBe('Comedy');
  });

  it('should update a genre by ID (PUT /genres/:id)', async () => {
    const updatedGenreDto: GenreDto = { name: 'Updated Drama' };

    const response = await request(app.getHttpServer())
      .put('/genres/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGenreDto);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Drama');
  });

  it('should return 404 when updating a non-existing genre (PUT /genres/:id)', async () => {
    const updatedGenreDto: GenreDto = { name: 'Nonexistent Genre' };
  
    const response = await request(app.getHttpServer())
      .put('/genres/999') // Non-existent ID
      .set('Authorization', `Bearer ${token}`)
      .send(updatedGenreDto);
  
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Genre not found.');
  });
  it('should get all genres (GET /genres)', async () => {
    const response = await request(app.getHttpServer())
      .get('/genres')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      {"count": 1, "items": [{"id": "1", "name": "Comedy"}]}
    );
  });
  it('should soft delete a genre by ID (delete /genres/:id )', async () => {
    const response = await request(app.getHttpServer())
      .delete('/genres/1')
      .set('Authorization', `Bearer ${token}`);
  
    // Check response
    expect(response.status).toBe(200);
  });
  
  it('should return 404 when soft deleting a non-existing genre (delete /genres/:id )', async () => {
    const response = await request(app.getHttpServer())
      .delete('/genres/999') // Non-existent ID
      .set('Authorization', `Bearer ${token}`);
  
    // Check response for non-existing genre
    expect(response.status).toBe(404);
  });
  
  
});
