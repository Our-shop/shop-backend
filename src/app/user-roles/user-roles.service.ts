import {Injectable, NotFoundException} from '@nestjs/common';
import {UserRoleRepo} from './repos/user-role.repo';
import {UserRoleDto} from './dtos/user-role.dto';
import {UserRoleEntity} from './entities/user-role.entity';
import {UserRoleUpdateDto} from './dtos/user-role.update.dto';

@Injectable()
export class UserRolesService {
    constructor(private readonly userRoleRepo: UserRoleRepo) {}

    async getAllUserRoles(): Promise<UserRoleEntity[]> {
        return await this.userRoleRepo.getList();
    }

    async getUserRoleById(id: string): Promise<UserRoleEntity> {
        return await this.userRoleRepo.getUserRole(id);
    }

    async addUserRole(newUserRole: UserRoleDto): Promise<UserRoleEntity> {
        return this.userRoleRepo.addUserRole(newUserRole);
    }

    async updateUserRole(id: string, updatedUserRoleDto: UserRoleUpdateDto) {
        return this.userRoleRepo.updateUserRole(id, updatedUserRoleDto);
    }

    async deleteUserRole(id: string): Promise<UserRoleEntity | string> {
        return this.userRoleRepo.deleteUserRole(id);
    }
}
