import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRolesService } from './user-roles.service';
import { UserRoleDto } from './dtos/user-role.dto';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { UserRoles } from './enums/user-roles.enum';

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

  @ApiOperation({ summary: 'Get role id by type' })
  @Get('/:type')
  async getRoleIdByType(
    @Param('type') type: UserRoles,
    @I18n() i18n: I18nContext,
  ): Promise<string> {
    try {
      const role = await this.userRolesService.getRoleByType(type);
      return UserRoleDto.fromEntity(role).id;
    } catch {
      throw new NotFoundException(i18n.t(ErrorCodes.NotFound_User_Role));
    }
  }

  @ApiOperation({ summary: 'Get user role by id' })
  @Get('/:userRoleId')
  async getUserRoleById(
    @Param('userRoleId') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<UserRoleDto | string> {
    try {
      const found = await this.userRolesService.getUserRoleById(id);
      return UserRoleDto.fromEntity(found);
    } catch {
      throw new NotFoundException(i18n.t(ErrorCodes.NotFound_User_Role));
    }
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
  ): Promise<UserRoleDto> {
    const role = await this.userRolesService.updateUserRole(
      id,
      updatedUserRoleDto,
    );
    return UserRoleDto.fromEntity(role);
  }

  @ApiOperation({ summary: 'Archive user role by id' })
  @Delete('/:userRoleId')
  async deleteUserRole(
    @Param('userRoleId') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<UserRoleDto> {
    try {
      const found = await this.userRolesService.deleteUserRole(id);
      return UserRoleDto.fromEntity(found);
    } catch {
      throw new NotFoundException(i18n.t(ErrorCodes.NotFound_User_Role));
    }
  }
}
