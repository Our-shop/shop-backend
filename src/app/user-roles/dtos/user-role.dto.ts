import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../enums/user-roles.enum';
import { IsArray, IsEnum } from 'class-validator';
import { UserPermissions } from '../enums/user-permissions.enum';
import { UserRoleEntity } from '../entities/user-role.entity';

export class UserRoleDto extends BasicDto {
  @ApiProperty({
    description: 'User role type',
    isArray: false,
    enum: UserRoles,
  })
  @IsEnum(UserRoles)
  type: UserRoles;

  @ApiProperty({
    description: 'User role permissions',
    isArray: true,
    enum: UserPermissions,
  })
  @IsArray({ context: UserPermissions })
  permissions: UserPermissions[];

  public static fromEntity(entity: UserRoleEntity) {
    const it = new UserRoleDto();
    it.id = entity.id;
    it.status = entity.status;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.type = entity.type;
    it.permissions = entity.permissions;

    return it;
  }

  static fromEntities(entities?: UserRoleEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }
}
