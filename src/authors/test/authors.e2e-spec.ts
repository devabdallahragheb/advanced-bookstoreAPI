import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthorsController } from '../authors.controller';
import { AuthorsService } from '../authors.service';
import Author from '../entities/authors.entity';
import { JwtAuthenticationGuard } from '../../common/guards/jwt-authentication.guard';
import CreateAuthorDto from '../dto/create-author.dto';
import UpdateAuthorDto from '../dto/update-author.dto';
import PaginationParams from 'src/common/types/pagination-params.type';
import { Repository } from 'typeorm';

// vip we have a multi way to use integration test  but in this app i use the same db   but it's not good way  i use it for save  time only i prefed to use In-memory databases
// Mock JwtAuthenticationGuard
jest.mock('../../common/guards/jwt-authentication.guard', () => ({
  JwtAuthenticationGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockResolvedValue(true),
  })),
}));

describe('AuthorsController (e2e)', () => {
  let app;
  let token: string;
  let authorsRepository: Repository<Author>;

  beforeAll(async () => {
    jest.setTimeout(30000);  // Set a longer timeout for the tests

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
          entities: [Author],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Author]),
      ],
      controllers: [AuthorsController],
      providers: [AuthorsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    authorsRepository = app.get(getRepositoryToken(Author));

    // Generate JWT token for testing authentication
    const jwtService = app.get(JwtService);
    token = jwtService.sign({ userId: '1', username: 'testuser' }, { secret: 'test-secret', expiresIn: '60s' });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test the 'POST /authors' endpoint (Create author)
  it('should create an author (POST /authors)', async () => {
    const createAuthorDto: CreateAuthorDto = {
      name: 'John Doe',
      biography: 'A biography of John Doe.',
      birthDate: new Date('1985-06-15'),
    };

    const response = await request(app.getHttpServer())
      .post('/authors')
      .set('Authorization', `Bearer ${token}`)
      .send(createAuthorDto);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(createAuthorDto.name);
    expect(response.body.biography).toBe(createAuthorDto.biography);
    expect(response.body.birthDate).toBe(createAuthorDto.birthDate.toISOString());
  });

  // Test the 'GET /authors' endpoint (List all authors)
  it('should list all authors (GET /authors)', async () => {
    const response = await request(app.getHttpServer())
      .get('/authors')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: 10, offset: 0 });

    expect(response.status).toBe(200);
    expect(response.body.count).toBeGreaterThanOrEqual(0);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  // Test the 'GET /authors/:id' endpoint (Get author by ID)
  it('should get an author by ID (GET /authors/:id)', async () => {
    const createdAuthor = await authorsRepository.save({
      name: 'Jane Doe',
      biography: 'A biography of Jane Doe.',
      birthDate: new Date('1990-07-20'),
    });

    const response = await request(app.getHttpServer())
      .get(`/authors/${createdAuthor.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdAuthor.id);
    expect(response.body.name).toBe(createdAuthor.name);
  });

  // Test the 'PUT /authors/:id' endpoint (Update author by ID)
  it('should update an author (PUT /authors/:id)', async () => {
    const createdAuthor = await authorsRepository.save({
      name: 'Updated Author',
      biography: 'Updated biography.',
      birthDate: new Date('1992-08-30'),
    });

    const updateAuthorDto: UpdateAuthorDto = {
      name: 'Updated Author Name',
      biography: 'Updated biography content.',
      birthDate: new Date('1993-09-10'),
    };

    const response = await request(app.getHttpServer())
      .put(`/authors/${createdAuthor.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateAuthorDto);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateAuthorDto.name);
    expect(response.body.biography).toBe(updateAuthorDto.biography);
  });

  // Test the 'DELETE /authors/:id' endpoint (Delete author)
  it('should delete an author (DELETE /authors/:id)', async () => {
    const createdAuthor = await authorsRepository.save({
      name: 'Author to Delete',
      biography: 'This author will be deleted.',
      birthDate: new Date('1995-10-15'),
    });

    const response = await request(app.getHttpServer())
      .delete(`/authors/${createdAuthor.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
