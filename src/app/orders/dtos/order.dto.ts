import {BasicDto} from '../../../shared/dto/basic.dto';
import {ApiProperty} from '@nestjs/swagger';
import {OrderEntity} from '../entities/order.entity';

export class OrderDto extends BasicDto {
  @ApiProperty({
    description: 'Total order amount',
  })
  totalAmount!: number;

  @ApiProperty({
    description: 'Delivery id',
  })
  deliveryId!: string;

  static fromEntity(entity?: OrderEntity) {
    if (!entity) {
      return;
    }
    const it = new OrderDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.status = entity.status;
    it.deliveryId = entity.deliveryId;
    it.totalAmount = entity.totalAmount;

    return it;
  }

  static fromEntities(entities?: OrderEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map((entity) => this.fromEntity(entity));
  }


}