import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { UserEntity } from '../entities/user.entity';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { UserSignUpForm } from '../../auth/dtos/user-sign-up.form';
import { UserRoleRepo } from '../../user-roles/repos/user-role.repo';
import { UserPermissions } from '../../user-roles/enums/user-permissions.enum';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserRepo extends EntityRepository<UserEntity> {
  constructor(
      private readonly entityManager: EntityManager,
      private readonly userRolesRepo: UserRoleRepo
  ) {
    super(entityManager, UserEntity);
  }

  async getList(): Promise<UserEntity[]> {
    return await this.findAll();
  }

  async getUser(id: string): Promise<UserEntity> {
    return await this.findOne({ id });
  }

  async getUserByEmail(email: string) {
    return await this.entityManager.findOne(UserEntity,{email: email});
  }

  async getUserPermissions(id: string): Promise<UserPermissions[]> {
    const user = await this.findOne({ id });
    const roleId = user.roleId;
    const userRole = await this.userRolesRepo.getUserRole(roleId);
    return userRole.permissions;
  }

  async addNewUser(dto: UserSignUpForm): Promise<UserEntity> {
    const newUser = this.create({
      userName: dto.userName,
      password: dto.password,
      email: dto.email,
      roleId: dto.roleId,
    });
    await this.entityManager.persistAndFlush(newUser);
    return newUser;
  }

  async updateUser(
    id: string,
    updateData: Partial<UserDto>,
  ): Promise<UserEntity | null> {
    const user = await this.findOne({ id });
    Object.assign(user, updateData);
    await this.entityManager.flush();
    return user ? user : null;
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const found = await this.findOne({ id });
    found.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(found);
    return found;
  }
}
