import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';

@Injectable()
export class UserRepo extends EntityRepository<UserEntity> {
  async getList() {
    const entities = await this.findAll();
    const users = UserDto.fromEntities(entities);
    return users || [];
  }

  async getUser(id: string): Promise<UserDto | string> {
    const found = await this.findOne({ id });
    if (!found) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    const user = UserDto.fromEntity(found);
    return user || null;
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
    const user = await this.findOne({ id });
    Object.assign(user, updateData);
    await this.getEntityManager().flush();
    return user ? user : null;
  }

  async deleteUser(id: string): Promise<UserEntity | string> {
    const found = await this.findOne({ id });
    found.status = BasicStatuses.Archived;
    await this.getEntityManager().persistAndFlush(found);
    return found;
  }
}
