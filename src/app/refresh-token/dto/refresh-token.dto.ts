import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';
import { NoStatusDto } from '../../../shared/dto/no-status.dto';
import {IsJWT, ValidateNested} from 'class-validator';

export class RefreshTokenDTO extends NoStatusDto {
  @ApiProperty()
  @IsJWT()
  refresh_token: string;

  @ApiProperty()
  @ValidateNested()
  user: UserDto;
}
