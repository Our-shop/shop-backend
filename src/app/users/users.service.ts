import { Injectable } from '@nestjs/common';
import { UserRepo } from './repos/user.repo';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepo) {}

  async getAllUsers() {
    return await this.userRepo.getList();
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.userRepo.getUser(id);
  }

  async addUser(newUser: UserDto): Promise<UserEntity> {
    return this.userRepo.addUser(newUser);
  }

  async updateUser(id: string, updatedUserDto: Partial<UserEntity>) {
    return this.userRepo.updateUser(id, updatedUserDto);
  }

  async deleteUser(id: string): Promise<UserEntity | string> {
    return this.userRepo.deleteUser(id);
  }
}
