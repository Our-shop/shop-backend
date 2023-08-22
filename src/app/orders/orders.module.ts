import { Module } from '@nestjs/common';
import {MikroOrmModule} from '@mikro-orm/nestjs';
import {OrdersService} from './orders.service';
import {OrdersController} from './orders.controller';
import {OrderEntity} from './entities/order.entity';
import {OrderItemEntity} from '../order-items/entities/order-item.entity';
import {OrderItemsRepo} from '../order-items/repos/order-item.repo';
// import {OrderItemsRepo} from '../order-items/repos/order-item.repo';
// import {DeliveryEntity} from '../order-items/entities/order-item.entity';

@Module({
    imports: [
        MikroOrmModule.forFeature({
            entities: [OrderEntity, OrderItemEntity],
        }),
    ],
    providers: [OrdersService, OrderItemsRepo],
    controllers: [OrdersController],
})
export class OrdersModule {}
