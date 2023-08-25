import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from '../order-items/entities/order-item.entity';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';
import { ProductEntity } from '../../shared/entities/product.entity';
import { ProductsRepo } from '../../shared/repos/products.repo';
import { OrdersRepo } from './repos/orders.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [OrderEntity, OrderItemEntity, ProductEntity],
    }),
  ],
  providers: [OrdersService, OrdersRepo, OrderItemsRepo, ProductsRepo],
  controllers: [OrdersController],
  exports: [OrdersRepo],
})
export class OrdersModule {}
