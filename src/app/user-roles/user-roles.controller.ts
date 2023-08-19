import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {UserRolesService} from './user-roles.service';
import {UserRoleDto} from './dtos/user-role.dto';
import {UserRoleEntity} from './entities/user-role.entity';

@ApiTags('user-roles')
@Controller('user-roles')
export class UserRolesController {
    constructor(private readonly userRolesService: UserRolesService) {}

    @Get()
    async getAllUserRoles(): Promise<UserRoleDto[]> {
        return await this.userRolesService.getAllUserRoles();
    }

    @Get('/:userId')
    async getUserRoleById(@Param('userId') id: string): Promise<UserRoleDto | string> {
        return await this.userRolesService.getUserRoleById(id);
    }

    @Post()
    async addUserRole(@Body() newUserRole: UserRoleDto): Promise<UserRoleEntity> {
        return this.userRolesService.addUserRole(newUserRole);
    }

    @Delete('/:userId')
    async deleteUserRole(@Param('userId') id: string): Promise<UserRoleEntity | string> {
        return this.userRolesService.deleteUserRole(id);
    }

    @Put('/:userId')
    async updateUserRole(
        @Param('userId') id: string,
        @Body() updatedUserRoleDto: Partial<UserRoleEntity>,
    ) {
        return this.userRolesService.updateUserRole(id, updatedUserRoleDto);
    }

}
