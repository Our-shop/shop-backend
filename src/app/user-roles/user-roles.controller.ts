import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserRolesService} from './user-roles.service';
import {UserRoleDto} from './dtos/user-role.dto';
import {UserRoleEntity} from './entities/user-role.entity';

@ApiTags('user-roles')
@Controller('user-roles')
export class UserRolesController {
    constructor(private readonly userRolesService: UserRolesService) {}

    @ApiOperation({ summary: 'Get all user roles' })
    @Get()
    async getAllUserRoles(): Promise<UserRoleDto[]> {
        return await this.userRolesService.getAllUserRoles();
    }

    @ApiOperation({ summary: 'Get user role by id' })
    @Get('/:userRoleId')
    async getUserRoleById(@Param('userRoleId') id: string): Promise<UserRoleDto | string> {
        return await this.userRolesService.getUserRoleById(id);
    }

    @ApiOperation({ summary: 'Create user role' })
    @Post()
    async addUserRole(@Body() newUserRole: UserRoleDto): Promise<UserRoleEntity> {
        return this.userRolesService.addUserRole(newUserRole);
    }

    @ApiOperation({ summary: 'Edit user role' })
    @Put('/:userRoleId')
    async updateUserRole(
        @Param('userRoleId') id: string,
        @Body() updatedUserRoleDto: Partial<UserRoleEntity>,
    ) {
        return this.userRolesService.updateUserRole(id, updatedUserRoleDto);
    }

    @ApiOperation({ summary: 'Archive user role by id' })
    @Delete('/:userRoleId')
    async deleteUserRole(@Param('userRoleId') id: string): Promise<UserRoleEntity | string> {
        return this.userRolesService.deleteUserRole(id);
    }

}
