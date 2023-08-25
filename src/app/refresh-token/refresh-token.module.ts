import { Module } from '@nestjs/common';
import {RefreshTokenRepo} from './repo/refresh-token.repo';

@Module({
  controllers: [],
  providers: [RefreshTokenRepo],
})
export class RefreshTokenModule {}
