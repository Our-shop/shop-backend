import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';

export class RefreshTokenDTO {
  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: UserDto;
}
