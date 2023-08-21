import {Entity, ManyToOne, Property} from '@mikro-orm/core';
import {BasicEntity} from '../../../shared/entities/basic.entity';
import {OrderItemsRepo} from '../repos/order-item.repo';
import {OrderEntity} from '../../orders/entities/order.entity';

@Entity({ tableName: 'order_items', customRepository: () => OrderItemsRepo})
export class OrderItemEntity extends BasicEntity {

    @Property({ name: 'title' })
    title!: string;

    @Property({ name: 'product_quantity' })
    quantity!: number;

    @Property({ name: 'product_price' })
    price!: number;

    @Property({ name: "order_id" })
    orderId!: string;

    @ManyToOne({
        entity: () => OrderEntity,
        inversedBy: (e) => e.orderItems,
        joinColumns: ['order_id'],
        referencedColumnNames: ['id'],
        nullable: true,
        lazy: true,
    })
    order?: OrderEntity;
}
