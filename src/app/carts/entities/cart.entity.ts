import { Cascade, Entity, OneToOne, Property } from '@mikro-orm/core';
import { BasicEntity } from '../../../shared/entities/basic.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CartsRepo } from '../repos/carts.repo';

@Entity({ tableName: 'carts', customRepository: () => CartsRepo })
export class CartEntity extends BasicEntity {
  @Property({ name: 'discount' })
  discount!: number;

  // TODO mapping data in connection with USER (if needed)
  @OneToOne(() => UserEntity, { cascade: [Cascade.ALL] })
  user!: UserEntity;
}
