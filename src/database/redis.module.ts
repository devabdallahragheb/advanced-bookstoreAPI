import { CacheModule } from '@nestjs/cache-manager';
import { CacheStoreFactory, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';  // Import as a function
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore as unknown as CacheStoreFactory,  // Explicitly cast it to CacheStoreFactory
      host: 'localhost',
      port: 6379,
      ttl: 60 * 60,  // Cache TTL of 1 hour
    }),
    BooksModule,
  ],
})
export class RedisModule {}

export default RedisModule;
