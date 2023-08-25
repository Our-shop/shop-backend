import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { RefreshTokenEntity } from '../entity/refresh-token.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {UserDto} from '../../users/dtos/user.dto';
import {RefreshTokenDTO} from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenRepo extends EntityRepository<RefreshTokenEntity> {
  constructor(private readonly entityManager: EntityManager) {
    super(entityManager, RefreshTokenEntity);
  }

  async addRefreshToken(entity: UserEntity, token: string) {
    const newToken = this.create({
      refresh_token: token,
      user: entity,
    });
    await this.entityManager.persistAndFlush(newToken);
    return newToken;
  }

  async getUserByToken(token: string) {
    const entity = await this.entityManager.findOne(RefreshTokenEntity,{ refresh_token: token });
   // return RefreshTokenDTO.fromEntity(entity);
    return entity.user;
  }

  async deleteRefreshToken(token) {
    const tokenEntity = await this.findOne({ refresh_token: token });
    await this.nativeDelete({ refresh_token: token });
    return tokenEntity;
  }
}
