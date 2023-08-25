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
    await this.entityManager.persistAndFlush(newToken);
    return newToken;
  }
}
