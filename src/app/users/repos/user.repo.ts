import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';

@Injectable()
export class UserRepo extends EntityRepository<UserEntity> {
  async getList() {
    return await this.findAll();
  }

  async getUser(id: string): Promise<UserEntity> {
    const found = await this.findOne({ id });
    if (!found) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    return found;
  }

  async addUser(dto: UserDto): Promise<UserEntity> {
    const newUser = this.create({
      id: dto.id,
      userName: dto.userName,
      password: dto.password,
      email: dto.email,
      // refreshToken: dto.refreshToken,
      status: dto.status,
      created: dto.created,
      updated: dto.updated,
    });
    await this.getEntityManager().persistAndFlush(newUser);
    return newUser;
  }

  async updateUser(
    id: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.getUser(id);
    Object.assign(user, updateData);
    await this.getEntityManager().flush();
    return user ? user : null;
  }

  async deleteUser(id: string): Promise<UserEntity | string> {
    const found = await this.getUser(id);
    found.status = BasicStatuses.Archived;
    await this.getEntityManager().persistAndFlush(found);
    return found;
  }
}
