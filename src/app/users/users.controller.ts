import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';

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
  async getUserById(@Param('userId') id: string): Promise<UserDto | string> {
    const entity = await this.usersService.getUserById(id);

    if (!entity) {
      return `User with id ${id} not found`
    }

    const user = UserDto.fromEntity(entity);
    return user || null;
  }

  @ApiOperation({ summary: 'Add user' })
  @Post()
  async addUser(@Body() newUser: UserDto): Promise<UserEntity> {
    return this.usersService.addUser(newUser);
  }

  @ApiOperation({ summary: 'Edit user' })
  @Put('/:userId')
  async updateUser(
    @Param('userId') id: string,
    @Body() updatedUserDto: Partial<UserEntity>,
  ) {
    return this.usersService.updateUser(id, updatedUserDto);
  }

  @ApiOperation({ summary: 'Archive user by id' })
  @Delete('/:userId')
  async deleteUser(@Param('userId') id: string): Promise<UserEntity | string> {
    return this.usersService.deleteUser(id);
  }
}
