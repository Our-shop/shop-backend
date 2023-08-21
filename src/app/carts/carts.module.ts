import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CartEntity } from './entities/cart.entity';
import { CartsRepo } from './repos/carts.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [CartEntity],
    }),
  ],
  controllers: [CartsController],
  providers: [CartsService, CartsRepo],
  exports: [CartsRepo],
})
export class CartsModule {}
