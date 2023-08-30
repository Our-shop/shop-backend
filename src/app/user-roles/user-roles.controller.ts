import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserRolesService} from './user-roles.service';
import {UserRoleDto} from './dtos/user-role.dto';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';

@ApiTags('user-roles')
@Controller('user-roles')
export class UserRolesController {
    constructor(private readonly userRolesService: UserRolesService) {}

    @ApiOperation({ summary: 'Get all user roles' })
    @Get()
    async getAllUserRoles(): Promise<UserRoleDto[]> {
        const entities = await this.userRolesService.getAllUserRoles();

        const userRoles = UserRoleDto.fromEntities(entities);
        return userRoles || [];
    }

    @ApiOperation({ summary: 'Get user role by id' })
    @Get('/:userRoleId')
    async getUserRoleById(@Param('userRoleId') id: string): Promise<UserRoleDto | string> {
        const found = await this.userRolesService.getUserRoleById(id);
        if (!found) {
            throw new NotFoundException(ErrorCodes.NotFound_User_Role);
        }
        return UserRoleDto.fromEntity(found);
    }

    @ApiOperation({ summary: 'Create user role' })
    @Post()
    async addUserRole(@Body() newUserRole: UserRoleDto): Promise<UserRoleDto> {
        const res = await this.userRolesService.addUserRole(newUserRole);

        return UserRoleDto.fromEntity(res);
    }

    @ApiOperation({ summary: 'Edit user role' })
    @Put('/:userRoleId')
    async updateUserRole(
        @Param('userRoleId') id: string,
        @Body() updatedUserRoleDto: Partial<UserRoleDto>,
    ) {
        return this.userRolesService.updateUserRole(id, updatedUserRoleDto);
    }

    @ApiOperation({ summary: 'Archive user role by id' })
    @Delete('/:userRoleId')
    async deleteUserRole(@Param('userRoleId') id: string): Promise<UserRoleDto> {
        const found = await this.userRolesService.deleteUserRole(id);
        if (!found) {
            throw new NotFoundException(ErrorCodes.NotFound_User_Role);
        }
        return UserRoleDto.fromEntity(found);
    }

}
