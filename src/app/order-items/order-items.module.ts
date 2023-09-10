import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderItemsRepo } from './repos/order-item.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [OrderItemEntity],
    }),
  ],
  exports: [OrderItemsRepo],
  providers: [OrderItemsService, OrderItemsRepo],
  controllers: [OrderItemsController],
})
export class OrderItemsModule {}
