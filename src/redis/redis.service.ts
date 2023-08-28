import {Inject, Injectable} from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache) {}

    async get(key: string) {
        console.log(`GET ${key} from Redis`);
        return await this.cache.get(key);
    }

    async set(key: string, value: unknown) {
        console.log(`SET ${key} on Redis`);
        return await this.cache.set(key, value);
    }

    async del(key: string) {
        await this.cache.del(key);
    }
}
