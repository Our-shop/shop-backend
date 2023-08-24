import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends BasicDto {
  @ApiProperty({
    description: 'User name',
  })
  userName!: string;

  @ApiProperty({
    description: 'User password',
  })
  password!: string;

  @ApiProperty({
    description: 'User email',
  })
  email!: string;

  @ApiProperty({
    description: 'User role id',
  })
  roleId!: string;

  // @ApiProperty({
  //   description: 'User refresh token',
  // })
  // refreshToken?: string;

  static fromEntity(entity?: UserEntity) {
    if (!entity) {
      return;
    }
    const it = new UserDto();
    it.id = entity.id;
    it.roleId = entity.roleId;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.status = entity.status;
    it.userName = entity.userName;
    it.password = entity.password;
    it.email = entity.email;
    // it.refreshToken = entity.refreshToken;


    return it;
  }

  static fromEntities(entities?: UserEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
