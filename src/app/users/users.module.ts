import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity';
import { OrdersRepo } from '../orders/repos/orders.repo';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserEntity],
    }),
  ],
  providers: [UsersService, OrdersRepo, OrderItemsRepo],
  controllers: [UsersController],
})
export class UsersModule {}
