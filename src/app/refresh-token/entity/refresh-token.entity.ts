import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { RefreshTokenRepo } from '../repo/refresh-token.repo';
import { UserEntity } from '../../users/entities/user.entity';
import {NoStatusEntity} from '../../../shared/entities/no-status.entity';

@Entity({
  tableName: 'refresh_tokens',
  customRepository: () => RefreshTokenRepo,
})
export class RefreshTokenEntity extends NoStatusEntity {
  @Property({ name: 'Refresh_token', length: 1000})
  refresh_token!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
