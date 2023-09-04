import { ApiProperty } from '@nestjs/swagger';
import { OrderItemEntity } from '../entities/order-item.entity';
import { NoStatusDto } from '../../../shared/dto/no-status.dto';
import { IsUUID } from 'class-validator';
import { ProductDto } from 'src/shared/dto/product.dto';

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
    required: false,
  })
  productQuantity?: number;

  @ApiProperty({
    description: 'Product title',
    required: false,
  })
  productTitle?: string;

  @ApiProperty({
    description: 'Product price',
    required: false,
  })
  productPrice?: number;

  @ApiProperty({
    description: 'Product',
    required: false,
  })
  product?: ProductDto;

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

    it.product = ProductDto.fromEntity(entity.product);

    return it;
  }

  static fromEntities(entities?: OrderItemEntity[]) {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
