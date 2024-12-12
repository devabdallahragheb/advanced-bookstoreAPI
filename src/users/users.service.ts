import { createHash } from 'crypto';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import PaginationParams from 'src/common/types/pagination-params.type';
import PostgresErrorCode from 'src/database/postgresErrorCode.enum';
import RegisterDto from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) return user;
    else
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
  }

  async findOneById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return user;
    else
      throw new HttpException(
        'User with this ID does not exist',
        HttpStatus.NOT_FOUND,
      );
  }

  async findAll(query: PaginationParams) {
    const { limit, offset } = query;
    const [items, count] = await this.usersRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return { count, items };
  }

  async create(userData: RegisterDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUserById(userId: number, updatedUserData: UpdateUserDto) {
    try {
      const updatedUser = await this.usersRepository.update(
        { id: userId },
        updatedUserData,
      );
      const isUpdated = Boolean(updatedUser.affected);
      if (!isUpdated)
        throw new HttpException('User was not found.', HttpStatus.NOT_FOUND);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email or phone already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.usersRepository.findOneBy({ id: userId });
  }

  async setActiveRefreshToken(userId: number, refreshToken: string) {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const hashedRefreshToken = await bcrypt.hash(hash, 10);
    await this.usersRepository.update(userId, {
      hashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOneById(userId);

    const hash = createHash('sha256').update(refreshToken).digest('hex');

    if (!user.hashedRefreshToken)
      throw new HttpException('User was not found.', HttpStatus.NOT_FOUND);

    const isRefreshTokenMatching = await bcrypt.compare(
      hash,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) return user;
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      hashedRefreshToken: null,
    });
  }

  async deleteOneById(userId: number) {
    await this.usersRepository.softDelete(userId);
  }
}
