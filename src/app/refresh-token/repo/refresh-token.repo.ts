import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { RefreshTokenEntity } from '../entity/refresh-token.entity';
import { UserEntity } from '../../users/entities/user.entity';

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
    await this.entityManager.nativeDelete(RefreshTokenEntity,{user: entity});
    await this.entityManager.persistAndFlush(newToken);
    return newToken;
  }

  async getTokenData(token: string) {
    return await this.entityManager.findOne(RefreshTokenEntity,{ refresh_token: token.substring(7) });
  }

  async deleteRefreshToken(token) {
    const tokenEntity = await this.entityManager.findOne(RefreshTokenEntity,{ refresh_token: token });
    await this.nativeDelete({ refresh_token: token });
    return tokenEntity;
  }
}
