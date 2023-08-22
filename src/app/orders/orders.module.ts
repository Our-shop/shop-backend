import { Module } from '@nestjs/common';
import {MikroOrmModule} from '@mikro-orm/nestjs';
import {OrdersService} from './orders.service';
import {OrdersController} from './orders.controller';
import {OrderEntity} from './entities/order.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [OrderEntity],
    }),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}