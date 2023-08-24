import { IsArray, IsNumber, IsString, IsUUID } from '@nestjs/class-validator';
import { UserPermissions } from 'src/app/user-roles/enums/user-permissions.enum';

// ============ enums ===============

// ============ entities =============
import { UserEntity } from 'src/app/users/entities/user.entity';
import { UserRoles } from '../../user-roles/enums/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UserSessionDto {
  @IsUUID()
  id: string;

  @IsString()
  email: string;

  // @ApiProperty({
  //   description: "User role type",
  //   isArray: false,
  //   enum: UserRoles
  // })
  // @IsEnum(UserRoles)
  // type: UserRoles;

  @IsUUID()
  role_id: string;

  @IsArray({ context: UserPermissions })
  permissions: UserPermissions[];

  @IsNumber()
  exp?: number;

  public static from(dto: UserSessionDto): UserSessionDto {
    return {
      id: dto.id,
      email: dto.email,
      role_id: dto.role_id,
      // type: dto.type,
      permissions: dto.permissions,
    };
  }

  public static fromEntity(
    entity: UserEntity,
    permissions: UserPermissions[],
  ): UserSessionDto {
    return {
      id: entity.id,
      email: entity.email,
      role_id: entity.roleId,
      // role: entity.role,
      permissions,
    };
  }
}
