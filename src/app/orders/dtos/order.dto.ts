import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { OrderEntity } from '../entities/order.entity';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';
import { OrderStatuses } from '../enums/order-statuses.enum';

export class OrderDto extends BasicDto {
  @ApiProperty({
    description: 'User id',
  })
  userId!: string;

  @ApiProperty({
    description: 'Delivery id',
    required: false,
  })
  deliveryId?: string;

  @ApiProperty({
    description: 'Order status',
    enum: BasicStatuses,
  })
  orderStatus!: OrderStatuses;

  @ApiProperty({
    description: 'Discount',
  })
  discount!: number;

  @ApiProperty({
    description: 'Total amount',
    required: false,
  })
  totalAmount?: number;

  static fromEntity(entity?: OrderEntity) {
    if (!entity) {
      return;
    }
    const it = new OrderDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.status = entity.status;
    it.userId = entity.userId;
    it.deliveryId = entity.deliveryId;
    it.orderStatus = entity.orderStatus;
    it.discount = entity.discount;
    it.totalAmount = entity.totalAmount;

    return it;
  }

  static fromEntities(entities?: OrderEntity[]) {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
