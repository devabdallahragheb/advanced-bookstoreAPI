import { createHash } from 'crypto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import RegisterDto from 'src/auth/dto/register.dto';
import ERROR_MESSAGES from 'src/common/enums/error.messgaes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Utility method to handle user not found errors
  private handleUserNotFoundError() {
    throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
  }

  // Finds user by email
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) this.handleUserNotFoundError();
    return user;
  }

  // Finds user by ID
  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) this.handleUserNotFoundError();
    return user;
  }

  // Finds all users with pagination
  async findAll(query: PaginationParams) {
    const { limit, offset } = query;
    const [items, count] = await this.usersRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return { count, items };
  }

  // Create a new user
  async create(userData: RegisterDto): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    try {
      console.log("new user ", newUser);
      
      await this.usersRepository.save(newUser);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          ERROR_MESSAGES.USER_EXIST,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(ERROR_MESSAGES.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return newUser;
  }

  // Update user by ID
  async updateUserById(userId: string, updatedUserData: UpdateUserDto): Promise<User> {
    const result = await this.usersRepository.update(userId, updatedUserData);
    if (!result.affected) this.handleUserNotFoundError();

    return this.usersRepository.findOneBy({ id: userId });
  }

  // Set hashed refresh token for the user
  async setActiveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    await this.usersRepository.update(userId, { hashedRefreshToken });
  }

  // Compare and validate refresh token
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user.hashedRefreshToken) {
      this.handleUserNotFoundError();
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      await this.hashRefreshToken(refreshToken),
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) return user;
    throw new HttpException('Refresh token does not match', HttpStatus.FORBIDDEN);
  }

  // Remove refresh token for user
  async removeRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { hashedRefreshToken: null });
  }

  // Soft delete user by ID
  async deleteOneById(userId: number): Promise<void> {
    await this.usersRepository.softDelete(userId);
  }

  // Utility method to hash the refresh token
  private async hashRefreshToken(refreshToken: string): Promise<string> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    return bcrypt.hash(hash, 10);
  }
}
