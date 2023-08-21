import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CartEntity } from '../entities/cart.entity';

export class CartDto extends BasicDto {
  @ApiProperty({
    description: 'Cart discount',
  })
  discount!: string;

  static fromEntity(entity?: CartEntity): CartDto {
    if (!entity) return;
    const it = new CartDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.status = entity.status;

    return it;
  }

  static fromEntities(entities?: CartEntity[]): CartDto[] {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
