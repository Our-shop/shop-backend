import { Injectable, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

import { RedisService } from '../../redis/redis.service';

import { UserRepo } from './repos/user.repo';
import { UserEntity } from './entities/user.entity';
import { OrdersRepo } from '../orders/repos/orders.repo';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';
import { UserSignUpForm } from '../auth/dtos/user-sign-up.form';
import {UserDto} from './dtos/user.dto';


@Injectable()
export class UsersService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userRepo: UserRepo,
    private readonly ordersRepo: OrdersRepo,
    private readonly orderItemsRepo: OrderItemsRepo,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    // const cachedValue = await this.redisService.get('all-users');
    // if (cachedValue) {
    //   console.log('CASHED');
    //   console.log(cachedValue);
    //   return cachedValue;
    // }
    return await this.userRepo.getList();
    // await this.redisService.set('all-users', users);
  }

  async getUserById(id: string): Promise<UserDto | string> {
    return await this.userRepo.getUser(id);
  }

  async addUser(dto: UserSignUpForm): Promise<UserEntity> {
    const newUser = await this.userRepo.addNewUser(dto);
    await this.ordersRepo.addNewCart(newUser.id);

    return newUser;
  }

  async updateUser(id: string, updatedUserDto: Partial<UserEntity>) {
    return this.userRepo.updateUser(id, updatedUserDto);
  }

  async deleteUser(id: string): Promise<UserEntity | string> {
    const archivedCart = await this.ordersRepo.archiveCartByUserId(id);
    await this.orderItemsRepo.deleteAllByCartId(archivedCart.id);

    return await this.userRepo.deleteUser(id);
  }
}
