import { Injectable } from '@nestjs/common';
import { UserRepo } from './repos/user.repo';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';
import { OrdersRepo } from '../orders/repos/orders.repo';
import { OrderItemsRepo } from '../order-items/repos/order-item.repo';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly ordersRepo: OrdersRepo,
    private readonly orderItemsRepo: OrderItemsRepo,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return await this.userRepo.getList();
  }

  async getUserById(id: string): Promise<UserDto | string> {
    return await this.userRepo.getUser(id);
  }

  async addUser(dto: UserDto): Promise<UserEntity> {
    const newUser = await this.userRepo.addUser(dto);
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
