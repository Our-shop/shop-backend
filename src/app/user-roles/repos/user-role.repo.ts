import {Injectable, NotFoundException} from '@nestjs/common';
import {EntityRepository} from '@mikro-orm/postgresql';
import {UserRoleEntity} from '../entities/user-role.entity';
import {BasicStatuses} from '../../../shared/enums/basic-statuses.enum';
import {UserRoleDto} from '../dtos/user-role.dto';

@Injectable()
export class UserRoleRepo extends EntityRepository<UserRoleEntity> {
    async getList() {
        const entities = await this.findAll();
        const userRoles = UserRoleDto.fromEntities(entities);
        return userRoles || [];
    }

    async getUserRole(id: string): Promise<UserRoleDto | string> {
        const found = await this.findOne({ id });
        if (!found) {
            throw new NotFoundException(`User role with id: ${id} not found`);
        }
        const userRole = UserRoleDto.fromEntity(found);
        return userRole || null;
    }

    async addUserRole(dto: UserRoleDto): Promise<UserRoleEntity> {
        const newUserRole = this.create({
            type: dto.type,
            permissions: dto.permissions,
        });
        await this.getEntityManager().persistAndFlush(newUserRole);
        return newUserRole;
    }

    async updateUserRole(
        id: string,
        updateData: Partial<UserRoleEntity>,
    ): Promise<UserRoleEntity | null> {
        const userRole = await this.findOne({ id });
        Object.assign(userRole, updateData);
        await this.getEntityManager().flush();
        return userRole ? userRole : null;
    }

    async deleteUserRole(id: string): Promise<UserRoleEntity | string> {
        const found = await this.findOne({ id });
        found.status = BasicStatuses.Archived;
        await this.getEntityManager().persistAndFlush(found);
        return found;
    }
}
