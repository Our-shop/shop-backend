import { ProductCategories } from '../enums/product-categories.enum';
import { BasicDto } from './basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';
import { ProductTypes } from '../enums/product-types.enum';

export class ProductDto extends BasicDto {
  @ApiProperty({
    description: 'Product title',
  })
  title!: string;

  @ApiProperty({
    description: 'Product price',
  })
  price!: number;

  @ApiProperty({
    description: 'Product description',
  })
  description!: string;

  @ApiProperty({
    description: 'Product image url',
  })
  image!: string;

  @ApiProperty({
    description: 'Product quantity',
  })
  quantity!: number;

  @ApiProperty({
    description: 'Product category',
    enum: ProductCategories,
  })
  category: ProductCategories;

  @ApiProperty({
    description: 'Product category',
    enum: ProductTypes,
  })
  type!: ProductTypes;

  static fromEntity(entity?: ProductEntity): ProductDto {
    if (!entity) return;
    const it = new ProductDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.status = entity.status;
    it.title = entity.title;
    it.price = entity.price;
    it.description = entity.description;
    it.image = entity.image;
    it.quantity = entity.quantity;
    it.category = entity.category;
    it.type = entity.type;

    return it;
  }

  static fromEntities(entities?: ProductEntity[]): ProductDto[] {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
