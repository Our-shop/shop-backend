import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';
import {RefreshTokenEntity} from '../entity/refresh-token.entity';
import {NoStatusDto} from '../../../shared/dto/no-status.dto';

export class RefreshTokenDTO extends NoStatusDto {
  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: UserDto;

  // static fromEntity(entity?: RefreshTokenEntity) {
  //   if (!entity) {
  //     return;
  //   }
  //   const it = new RefreshTokenDTO();
  //   it.refresh_token = entity.refresh_token;
  //   it.user = entity.user;
  //   it.id = entity.id;
  //   it.created = entity.created.valueOf();
  //   it.updated = entity.updated.valueOf();
  //
  //   return it;
  // }
  //
  // static fromEntities(entities?: RefreshTokenEntity[]) {
  //   if (!entities?.map) {
  //     return;
  //   }
  //   return entities.map((entity) => this.fromEntity(entity));
  // }
}
