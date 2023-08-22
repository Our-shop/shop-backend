import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CartItemEntity } from '../entities/cart-item.entity';

export class CartItemDto extends BasicDto {
  @ApiProperty({
    description: 'CartItem cart id',
  })
  cartId!: string;

  @ApiProperty({
    description: 'CartItem product id',
  })
  productId!: string;

  @ApiProperty({
    description: 'CartItem product quantity',
  })
  productQuantity!: number;

  static fromEntity(entity?: CartItemEntity): CartItemDto {
    if (!entity) return;
    const it = new CartItemDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.status = entity.status;
    it.cartId = entity.cartId;
    it.productId = entity.productId;
    it.productQuantity = entity.productQuantity;

    return it;
  }

  static fromEntities(entities?: CartItemEntity[]): CartItemDto[] {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
