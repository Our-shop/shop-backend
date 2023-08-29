import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity';
import { OrdersRepo } from '../orders/repos/orders.repo';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';
import { UserRepo } from './repos/user.repo';
import { UserRoleRepo } from '../user-roles/repos/user-role.repo';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserEntity, UserRoleEntity],
    }),
    RedisModule
  ],
  controllers: [UsersController],
  providers: [UsersService, OrdersRepo, OrderItemsRepo , UserRepo, UserRoleRepo],
  exports: [UserRepo]
})
export class UsersModule {}
