import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';

export class RefreshTokenDTO {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserDto;
}
