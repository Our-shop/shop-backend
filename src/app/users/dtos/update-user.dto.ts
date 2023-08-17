import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UpdatedUserDto extends PartialType(
  OmitType(UserDto, ['id'] as const),
) {}
