import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from '../order-items/entities/order-item.entity';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';
import { ProductEntity } from '../../shared/entities/product.entity';
import { ProductsRepo } from '../products/products.repo';
import { OrdersRepo } from './repos/orders.repo';
import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [OrderEntity, OrderItemEntity, ProductEntity],
    }),
  ],
  providers: [
    OrdersService,
    OrdersRepo,
    OrderItemsRepo,
    ProductsRepo,
    RefreshTokenRepo,
    JwtService,
  ],
  controllers: [OrdersController],
  exports: [OrdersRepo],
})
export class OrdersModule {}
