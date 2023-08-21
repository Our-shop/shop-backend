import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CartEntity } from './entities/cart.entity';
import { CartsRepo } from './repos/carts.repo';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forFeature({
      entities: [CartEntity],
    }),
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepo],
})
export class CartsModule {}
