import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import {ConfigService} from '@nestjs/config';
import {RedisService} from './redis.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                store: await redisStore({
                    url: configService.get('REDIS_URI'),
                    ttl: 5000,
                })
            }),
            isGlobal: true,
            inject: [ConfigService],
        }),
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule {}
