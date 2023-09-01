import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    const entities = await this.usersService.getAllUsers();

    const users = UserDto.fromEntities(entities);
    return users || [];
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get('/:userId')
  async getUserById(
      @Param('userId') id: string,
      @I18n() i18n: I18nContext
  ): Promise<UserDto | string> {
    try {
      const entity = await this.usersService.getUserById(id);
      const user = UserDto.fromEntity(entity);
      return user || null;
    } catch {
      throw new NotFoundException(
          i18n.t(ErrorCodes.NotExists_User)
      );
    }
  }

  @ApiOperation({ summary: 'Add user' })
  @Post()
  async addUser(@Body() newUser: UserDto): Promise<UserDto> {
    const res = await this.usersService.addUser(newUser);

    return UserDto.fromEntity(res);
  }

  @ApiOperation({ summary: 'Edit user' })
  @Put('/:userId')
  async updateUser(
    @Param('userId') id: string,
    @Body() updatedUserDto: Partial<UserDto>,
  ): Promise<UserDto> {
    const res = await this.usersService.updateUser(id, updatedUserDto);
    return UserDto.fromEntity(res);
  }

  @ApiOperation({ summary: 'Archive user by id' })
  @Delete('/:userId')
  async deleteUser(
      @Param('userId') id: string,
      @I18n() i18n: I18nContext
  ): Promise<UserDto> {
    try {
      const res = await this.usersService.deleteUser(id);
      return UserDto.fromEntity(res);
    } catch {
        throw new NotFoundException(i18n.t(ErrorCodes.NotExists_User))
    }
  }
}
