import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity';
import { CartsRepo } from '../carts/repos/carts.repo';
import { CartItemsRepo } from '../cart-items/repos/cart-items.repo';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserEntity],
    }),
  ],
  providers: [UsersService, CartsRepo, CartItemsRepo],
  controllers: [UsersController],
})
export class UsersModule {}
