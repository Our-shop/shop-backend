import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';
import {NoStatusDto} from '../../../shared/dto/no-status.dto';

export class RefreshTokenDTO extends NoStatusDto {
  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: UserDto;
}
