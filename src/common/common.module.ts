import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { BooksModule } from 'src/books/books.module';
import { GenresModule } from 'src/genres/genres.module';

@Module({
  controllers: [],
  exports: [],
  imports: [
    AuthModule,
    UsersModule,
    AuthorsModule,
    PassportModule,
    BooksModule,
    GenresModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class CommonModule {}
