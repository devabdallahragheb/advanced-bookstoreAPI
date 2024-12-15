import { v4 as uuidv4 } from 'uuid'; // Import UUID generation
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';
import Book from '../entities/book.entity';
import Author from '../../authors/entities/authors.entity';
import Genre from '../../genres/entities/genres.entity';
import CreateBookDto from '../dto/create-book.dto';
import { JwtAuthenticationGuard } from '../../common/guards/jwt-authentication.guard';
import UpdateBookDto from '../dto/update-book.dto';

jest.mock('../../common/guards/jwt-authentication.guard', () => ({
  JwtAuthenticationGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockResolvedValue(true), // Always allow in the test
  })),
}));

describe('BooksController (e2e)', () => {
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
          entities: [Book, Author, Genre],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Book, Author, Genre]),
      ],
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateBookDto) => ({
              id: uuidv4(),
              ...dto,
            })),
            save: jest.fn().mockImplementation((book) => book),
            findOneOrFail: jest.fn().mockResolvedValue({
              id: '1',
              title: 'Intro to JS',
              description: 'JS Programming',
              publicationDate: new Date('1990-01-01'),
              author: { id: 'author-id', name: 'Author Name' },
              genre: { id: 'genre-id', name: 'Programming' },
            }),
            findAndCount: jest.fn().mockResolvedValue([
              [{ id: '1', title: 'Intro to JS' }],
              1,
            ]),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    const jwtService = app.get(JwtService);
    token = jwtService.sign({ userId: 1, username: 'testuser' }, { secret: 'test-secret', expiresIn: '60s' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a book (POST /books)', async () => {
    const createBookDto: CreateBookDto = {
      title: 'ahmed',
      description: 'ahmed',
      publicationDate: new Date('2024-12-14T06:36:52.542Z'),
      authorId: '9b3224ac-c8fe-48ab-9b1f-1177c5a87d11',  // Use real UUID from the working response
      genreId: '317ddbc7-c1c6-4b82-8f02-594718f0e03e',   // Use real UUID from the working response
    };
    

    const response = await request(app.getHttpServer())
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send(createBookDto);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(createBookDto.title);
    expect(response.body.description).toBe(createBookDto.description);
  });

  it('should list all books (GET /books)', async () => {
    const response = await request(app.getHttpServer())
      .get('/books')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 10, offset: 0 });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.items.length).toBeGreaterThan(0);
  });
  it('should get a book by ID (GET /books/:id)', async () => {
    const response = await request(app.getHttpServer())
      .get('/books/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('1');
    expect(response.body.title).toBe('Intro to JS');
  });
  it('should update a book (PUT /books/:id)', async () => {
    const updateBookDto: UpdateBookDto = {
      title: 'Updated Book Title',
      description: 'Updated Description',
      publicationDate: new Date('2025-01-01T00:00:00.000Z'),
      authorId: '9b3224ac-c8fe-48ab-9b1f-1177c5a87d11',
      genreId: '317ddbc7-c1c6-4b82-8f02-594718f0e03e',
    };

    const response = await request(app.getHttpServer())
      .put('/books/1')
      .set('Authorization', `Bearer ${token}`)
      .send(updateBookDto);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updateBookDto.title);
    expect(response.body.description).toBe(updateBookDto.description);
  });
  it('should delete a book (DELETE /books/:id)', async () => {
    const response = await request(app.getHttpServer())
      .delete('/books/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
