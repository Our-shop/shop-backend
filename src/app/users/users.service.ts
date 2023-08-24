import { Injectable } from '@nestjs/common';
import { UserRepo } from './repos/user.repo';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';
import { CartsRepo } from '../carts/repos/carts.repo';
import { CartItemsRepo } from '../cart-items/repos/cart-items.repo';
import {UserSignUpForm} from '../auth/dtos/user-sign-up.form';
// import {UserRoleDto} from '../user-roles/dtos/user-role.dto';
// import {UserRoleRepo} from '../user-roles/repos/user-role.repo';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly cartRepo: CartsRepo,
    private readonly cartItemsRepo: CartItemsRepo,
    // private readonly userRoleRepo: UserRoleRepo,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return await this.userRepo.getList();
  }

  async getUserById(id: string): Promise<UserDto | string> {
    return await this.userRepo.getUser(id);
  }

  async addUser(dto: UserSignUpForm): Promise<UserEntity> {
    // const userRole = await this.userRoleRepo.getUserRole(dto.roleId);
    // const roleDto =  UserRoleDto.fromEntity(userRole);
    const newUser = await this.userRepo.addUser(dto);
    await this.cartRepo.addByUserId(newUser.id);
    return newUser;
  }

  async updateUser(id: string, updatedUserDto: Partial<UserEntity>) {
    return this.userRepo.updateUser(id, updatedUserDto);
  }

  async deleteUser(id: string): Promise<UserEntity | string> {
    const archivedCart = await this.cartRepo.archiveByUserId(id);
    await this.cartItemsRepo.archiveAllByCartId(archivedCart.id);

    return await this.userRepo.deleteUser(id);
  }
}
