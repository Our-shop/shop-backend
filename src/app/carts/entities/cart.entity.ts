import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { BasicEntity } from '../../../shared/entities/basic.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity()
export class CartEntity extends BasicEntity {
  @Property({ name: 'discount' })
  discount!: number;

  @OneToOne(() => UserEntity, {
    lazy: true,
    nullable: true,
    owner: true,
    joinColumn: 'id',
    inverseJoinColumn: 'id',
  })
  user!: UserEntity;
}
