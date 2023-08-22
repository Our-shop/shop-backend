import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BasicEntity } from '../../../shared/entities/basic.entity';
import { CartItemsRepo } from '../repos/cart-items.repo';
import { CartEntity } from '../../carts/entities/cart.entity';

@Entity({ tableName: 'cart_items', customRepository: () => CartItemsRepo })
export class CartItemEntity extends BasicEntity {
  @Property({ name: 'cart_id' })
  cartId!: string;

  @Property({ name: 'product_id' })
  productId!: string;

  @Property({ name: 'product_quantity' })
  productQuantity!: number;

  // TODO mapping data in connection with CART (if needed)
  @ManyToOne({
    entity: () => CartEntity,
    inversedBy: (cart) => cart.cartItems,
    joinColumns: ['cart_id'],
    referencedColumnNames: ['id'],
    nullable: true,
    lazy: true,
  })
  cart?: CartEntity;
}
