import { CacheModule, CacheStoreFactory, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';  // Import as a function
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [
    BooksModule, // Include the BooksModule here
    CacheModule.registerAsync({
      imports: [],
      inject: [ConfigService],  
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as unknown as CacheStoreFactory,  
        host:  configService.get('REDIS_HOST'),   
        port: configService.get('REDIS_PORT'),  
        ttl: 60 * 60,  // Cache TTL of 1 hour
      }),
    }),
  ],
})
export class RedisModule {}

export default RedisModule;
