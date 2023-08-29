import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Matches, MaxLength, MinLength, IsEmail } from 'class-validator';
import { ErrorCodes } from '../../../shared/enums/error-codes.enum';
import { UserEntity } from '../entities/user.entity';

export class UserDto extends BasicDto {
  @ApiProperty({
    description: 'User name',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  userName!: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  @MinLength(6)
  @MaxLength(20)
  @Matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$/,
      {
        message:
            'Password should contain at least 6 characters including:' +
            '* 1 Uppercase letter, ' +
            '* 1 Lowercase letter,  ' +
            '* 1 number or special character',
      },
  )
  password!: string;

  @ApiProperty({
    description: 'User email',
  })
  @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
  email!: string;

  @ApiProperty({
    description: 'User role id',
  })
  @IsUUID()
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
