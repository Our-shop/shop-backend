import { Entity, Property, Enum, OneToMany } from '@mikro-orm/core';
import { BasicEntity } from './basic.entity';
import { ProductCategories } from '../enums/product-categories.enum';
import { ProductTypes } from '../enums/product-types.enum';
import { OrderItemEntity } from '../../app/order-items/entities/order-item.entity';

@Entity({
  abstract: true,
  tableName: 'products',
  discriminatorColumn: 'category',
})
export abstract class ProductEntity extends BasicEntity {
  @Property({ name: 'title' })
  title!: string;

  @Property({ name: 'price', type: 'double' })
  price!: number;

  @Property({ name: 'description' })
  description!: string;

  @Property({ name: 'image' })
  image!: string;

  @Property({ name: 'quantity' })
  quantity!: number;

  @Enum({ name: 'category', array: false, items: () => ProductCategories })
  category!: ProductCategories;

  @Enum({ name: 'type', array: false, items: () => ProductTypes })
  type!: ProductTypes;

  // TODO add links here...
  @OneToMany(() => OrderItemEntity, (item) => item.product)
  orderItems?: OrderItemEntity[];
}
