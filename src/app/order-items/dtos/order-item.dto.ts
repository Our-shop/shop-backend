import {BasicDto} from '../../../shared/dto/basic.dto';
import {ApiProperty} from '@nestjs/swagger';
import {OrderItemEntity} from '../entities/order-item.entity';

export class OrderItemDto extends BasicDto {
    @ApiProperty({
        description: 'Title',
    })
    title!: string;

    @ApiProperty({
        description: 'Quantity',
    })
    quantity!: number;

    @ApiProperty({
        description: 'Price',
    })
    price!: number;

    @ApiProperty({
        description: 'Order id',
    })
    orderId!: string;

    static fromEntity(entity?: OrderItemEntity) {
        if (!entity) {
            return;
        }
        const it = new OrderItemDto();
        it.id = entity.id;
        it.created = entity.created.valueOf();
        it.updated = entity.updated.valueOf();
        it.status = entity.status;
        it.orderId = entity.orderId;
        it.price = entity.price;
        it.quantity = entity.quantity;
        it.title = entity.title;

        return it;
    }

    static fromEntities(entities?: OrderItemEntity[]) {
        if (!entities?.map) {
            return;
        }
        return entities.map((entity) => this.fromEntity(entity));
    }
}
