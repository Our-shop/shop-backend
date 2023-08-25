import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity';
import { CartsRepo } from '../carts/repos/carts.repo';
import { CartItemsRepo } from '../cart-items/repos/cart-items.repo';
import { UserRepo } from './repos/user.repo';
import { UserRoleRepo } from '../user-roles/repos/user-role.repo';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserEntity, UserRoleEntity],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, CartsRepo, CartItemsRepo, UserRepo, UserRoleRepo],
  exports: [UserRepo]
})
export class UsersModule {}
