import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { PostgresErrorCode } from '../database/postgresErrorCode.enum';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../common/types/token-payload.type';
import { User } from '../users/entities/user.entity';
import ERROR_MESSAGES from 'src/common/enums/error.messgaes';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          ERROR_MESSAGES.USER_EXIST,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        ERROR_MESSAGES.DATABASE_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        ERROR_MESSAGES.WRONG_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: AccessTokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.userId) {
      return this.usersService.findOneById(payload.userId);
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password.toString());
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        ERROR_MESSAGES.WRONG_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getJwtAccessToken(user: User) {
    const payload: AccessTokenPayload = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    return token;
  }

  public getJwtRefreshToken(user: User) {
    const payload: RefreshTokenPayload = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    return token;
  }
}
