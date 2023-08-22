import { Module } from '@nestjs/common';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartItemsRepo } from './repos/cart-items.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [CartItemEntity],
    }),
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService, CartItemsRepo],
  exports: [CartItemsRepo],
})
export class CartItemsModule {}
