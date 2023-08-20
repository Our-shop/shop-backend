import {Entity, Property} from '@mikro-orm/core';
import {BasicEntity} from '../../../shared/entities/basic.entity';
import {OrdersRepo} from '../repos/orders.repo';

@Entity({ tableName: 'orders', customRepository: () => OrdersRepo})
export class OrderEntity extends BasicEntity {
    @Property({ name: 'total_amount' })
    totalAmount!: number;

    @Property({ name: "delivery_id" })
    deliveryId!: string;

    // TODO
    // @ManyToOne({
    //     entity: () => DeliveryEntity,
    //     inversedBy: (e) => e.deliveries,
    //     joinColumns: ['delivery_id'],
    //     referencedColumnNames: ['id'],
    //     nullable: true,
    //     lazy: true,
    // })
    // delivery?: DeliveryEntity;

}
