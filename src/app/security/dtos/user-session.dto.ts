import { IsArray, IsNumber, IsUUID } from '@nestjs/class-validator';
import { IsEmail } from 'class-validator';
// ============ enums ===============
import { UserPermissions } from 'src/app/user-roles/enums/user-permissions.enum';
// ============ entities =============
import { UserEntity } from 'src/app/users/entities/user.entity';


export class UserSessionDto {
  @IsUUID()
  id: string;

  @IsEmail()
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
