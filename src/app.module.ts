import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseModule from './database/database.module';
import { validate } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import LoggingMiddleware from './common/middleware/logging.middleware';
import { AuthorsModule } from './authors/authors.module';
import { GenresModule } from './genres/genres.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    UsersModule,
    AuthModule,
    AuthorsModule,
    GenresModule,
    CommonModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
