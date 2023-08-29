import { ApiProperty } from '@nestjs/swagger';
import { OrderItemEntity } from '../entities/order-item.entity';
import { NoStatusDto } from '../../../shared/dto/no-status.dto';
import { IsString } from '@nestjs/class-validator';
import { ErrorCodes } from '../../../shared/enums/error-codes.enum';
import {IsNumber, IsUUID} from 'class-validator';

export class OrderItemDto extends NoStatusDto {
  @ApiProperty({
    description: 'Order id',
    required: false,
  })
  @IsUUID()
  orderId?: string;

  @ApiProperty({
    description: 'Product id',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    description: 'Product quantity',
  })
  @IsNumber()
  productQuantity!: number;

  @ApiProperty({
    description: 'Product title',
    required: false,
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  productTitle?: string;

  @ApiProperty({
    description: 'Product price',
    required: false,
  })
  @IsNumber()
  productPrice?: number;

  static fromEntity(entity?: OrderItemEntity) {
    if (!entity) {
      return;
    }
    const it = new OrderItemDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.orderId = entity.orderId;
    it.productId = entity.productId;
    it.productQuantity = entity.productQuantity;
    it.productTitle = entity.productTitle;
    it.productPrice = entity.productPrice;

    return it;
  }

  static fromEntities(entities?: OrderItemEntity[]) {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
