import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { RefreshTokenRepo } from '../repo/refresh-token.repo';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({
  tableName: 'refresh_tokens',
  customRepository: () => RefreshTokenRepo,
})
export class RefreshTokenEntity extends UUIDEntity {
  @Property({ name: 'Refresh_token'})
  token!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
