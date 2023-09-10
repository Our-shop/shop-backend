import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { OrderItemsRepo } from '../repos/order-item.repo';
import { OrderEntity } from '../../orders/entities/order.entity';
import { NoStatusEntity } from '../../../shared/entities/no-status.entity';
import { ProductEntity } from '../../../shared/entities/product.entity';

@Entity({ tableName: 'order_items', customRepository: () => OrderItemsRepo })
export class OrderItemEntity extends NoStatusEntity {
  @Property({ name: 'order_id', nullable: true })
  orderId?: string;

  @Property({ name: 'product_id' })
  productId!: string;

  @Property({ name: 'product_quantity', type: 'integer' })
  productQuantity = 1;

  @Property({ name: 'product_title', nullable: true })
  productTitle?: string;

  @Property({ name: 'product_price', type: 'double', nullable: true })
  productPrice?: number;

  @ManyToOne({
    entity: () => OrderEntity,
    inversedBy: (e) => e.orderItems,
    joinColumns: ['order_id'],
    referencedColumnNames: ['id'],
    nullable: true,
    lazy: true,
  })
  order?: OrderEntity;

  @ManyToOne({
    entity: () => ProductEntity,
    inversedBy: (product) => product.orderItems,
    joinColumns: ['product_id'],
    referencedColumnNames: ['id'],
    nullable: true,
    lazy: true,
  })
  product?: ProductEntity;
}
