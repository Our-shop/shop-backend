import { Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BasicEntity } from '../../../shared/entities/basic.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CartsRepo } from '../repos/carts.repo';
import { CartItemEntity } from '../../cart-items/entities/cart-item.entity';

@Entity({ tableName: 'carts', customRepository: () => CartsRepo })
export class CartEntity extends BasicEntity {
  @Property({ name: 'user_id' })
  userId!: string;

  @Property({ name: 'discount' })
  discount!: number;

  // TODO mapping data in connection with USER (if needed)
  @ManyToOne({
    entity: () => UserEntity,
    inversedBy: (user) => user.carts,
    joinColumns: ['user_id'],
    referencedColumnNames: ['id'],
    nullable: true,
    lazy: true,
  })
  user?: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  cartItems?: CartItemEntity[];
}
