import {Entity, ManyToOne, OneToMany, Property} from '@mikro-orm/core';
import {BasicEntity} from '../../../shared/entities/basic.entity';
import {DeliveryRepo} from '../repos/delivery.repo';
import {UserEntity} from '../../users/entities/user.entity';
import {OrderEntity} from '../../orders/entities/order.entity';

@Entity({ tableName: 'delivery', customRepository: () => DeliveryRepo})
export class DeliveryEntity extends BasicEntity {
    @Property({ name: "user_id" })
    userId!: string;

    @Property({ name: "city" })
    city!: string;

    @Property({ name: "address" })
    address!: string;

    @Property({ name: "phone" })
    phone!: string;

    @ManyToOne({
        entity: () => UserEntity,
        inversedBy: (e) => e.deliveries,
        joinColumns: ['user_id'],
        referencedColumnNames: ['id'],
        nullable: true,
        lazy: true,
    })
    user?: UserEntity;

    @OneToMany(() => OrderEntity, (e) => e.delivery)
    orders?: OrderEntity[];

}
