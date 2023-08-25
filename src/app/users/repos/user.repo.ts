import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { UserSignUpForm } from '../../auth/dtos/user-sign-up.form';
import { UserRoleRepo } from '../../user-roles/repos/user-role.repo';

@Injectable()
export class UserRepo extends EntityRepository<UserEntity> {
  constructor(
      private readonly entityManager: EntityManager,
      private readonly userRolesRepo: UserRoleRepo
  ) {
    super(entityManager, UserEntity);
  }

  async getList(): Promise<UserDto[]> {
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

  async getUserByEmail(email: string) {
    return await this.entityManager.findOne(UserEntity,{email: email});
  }

  async getByEmailAndPassword(email: string, password: string) {
    return await this.entityManager.findOne(UserEntity,{ email, password });
  }

  async getUserPermissions(id: string) {
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
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.findOne({ id });
    Object.assign(user, updateData);
    await this.entityManager.flush();
    return user ? user : null;
  }

  async deleteUser(id: string): Promise<UserEntity | string> {
    const found = await this.findOne({ id });
    found.status = BasicStatuses.Archived;
    await this.entityManager.persistAndFlush(found);
    return found;
  }
}
