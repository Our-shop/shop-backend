import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityManager, EntityRepository} from '@mikro-orm/postgresql';
import {UserRoleEntity} from '../entities/user-role.entity';
import {BasicStatuses} from '../../../shared/enums/basic-statuses.enum';
import {UserRoleDto} from '../dtos/user-role.dto';
import {UserEntity} from '../../users/entities/user.entity';
import {OrderEntity} from '../../orders/entities/order.entity';

@Injectable()
export class UserRoleRepo extends EntityRepository<UserRoleEntity> {
    constructor(private readonly entityManager: EntityManager) {
        super(entityManager, UserRoleEntity);
    }

    async getList(): Promise<UserRoleEntity[]> {
        return await this.findAll();
    }

    async getUserRole(id: string): Promise<UserRoleEntity> {
        return await this.entityManager.findOne(UserRoleEntity,{id: id});
    }

    async addUserRole(dto: UserRoleDto): Promise<UserRoleEntity> {
        const newUserRole = this.create({
            type: dto.type,
            permissions: dto.permissions,
        });
        await this.entityManager.persistAndFlush(newUserRole);
        return newUserRole;
    }

    async updateUserRole(
        id: string,
        updateData: Partial<UserRoleEntity>,
    ): Promise<UserRoleEntity | null> {
        const userRole = await this.findOne({ id });
        Object.assign(userRole, updateData);
        await this.entityManager.flush();
        return userRole ? userRole : null;
    }

    async deleteUserRole(id: string): Promise<UserRoleEntity | string> {
        const found = await this.findOne({ id });
        found.status = BasicStatuses.Archived;
        await this.entityManager.persistAndFlush(found);
        return found;
    }
}
