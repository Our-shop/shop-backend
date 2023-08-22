import {Entity, ManyToOne, OneToMany, Property} from '@mikro-orm/core';
import {BasicEntity} from '../../../shared/entities/basic.entity';
import {OrdersRepo} from '../repos/orders.repo';
import {UserEntity} from '../../users/entities/user.entity';
import {DeliveryEntity} from '../../delivery/entities/delivery.entity';
import {OrderItemEntity} from '../../order-items/entities/order-item.entity';

@Entity({ tableName: 'orders', customRepository: () => OrdersRepo})
export class OrderEntity extends BasicEntity {
    @Property({ name: 'total_amount' })
    totalAmount!: number;

    @Property({ name: "delivery_id" })
    deliveryId!: string;

    @Property({ name: "user_id" })
    userId!: string;

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: (e) => e.orders,
        joinColumns: ['user_id'],
        referencedColumnNames: ['id'],
        nullable: true,
        lazy: true,
    })
    user?: UserEntity;

    @ManyToOne({
        entity: () => DeliveryEntity,
        inversedBy: (e) => e.orders,
        joinColumns: ['delivery_id'],
        referencedColumnNames: ['id'],
        nullable: true,
        lazy: true,
    })
    delivery?: DeliveryEntity;

    @OneToMany(() => OrderItemEntity, (e) => e.order)
    orderItems?: OrderItemEntity[];

}
