import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('/:userId')
  async getUserById(@Param('userId') id: string): Promise<UserDto | string> {
    return await this.usersService.getUserById(id);
  }

  @Post()
  async addUser(@Body() newUser: UserDto): Promise<UserEntity> {
    return this.usersService.addUser(newUser);
  }

  @Delete('/:userId')
  async deleteUser(@Param('userId') id: string): Promise<UserEntity | string> {
    return this.usersService.deleteUser(id);
  }

  @Put('/:userId')
  async updateUser(
    @Param('userId') id: string,
    @Body() updatedUserDto: Partial<UserEntity>,
  ) {
    return this.usersService.updateUser(id, updatedUserDto);
  }
}
