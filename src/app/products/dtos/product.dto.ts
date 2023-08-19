import { ProductCategories } from '../enums/product-categories.enum';
import { BasicDto } from '../../../shared/dto/basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';

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
  category!: ProductCategories;

  @ApiProperty({
    description: 'Product type',
  })
  type!: string;

  @ApiProperty({
    description: 'Product(food) expiration date',
    required: false,
  })
  expirationDate?: Date;

  @ApiProperty({
    description: 'Product(clothes) size',
    required: false,
  })
  size?: string;

  @ApiProperty({
    description: 'Product(toys) recommended age',
    required: false,
  })
  recommendedAge?: number;

  static fromEntity(entity?: ProductEntity): ProductDto {
    if (!entity) return;
    const it = new ProductDto();
    it.id = entity.id;
    it.created = entity.created;
    it.updated = entity.updated;
    it.status = entity.status;
    it.title = entity.title;
    it.price = entity.price;
    it.description = entity.description;
    it.image = entity.image;
    it.quantity = entity.quantity;
    it.category = entity.category;
    it.type = entity.type;
    it.expirationDate = entity.expirationDate;
    it.size = entity.size;
    it.recommendedAge = entity.recommendedAge;

    return it;
  }

  static fromEntities(entities?: ProductEntity[]): ProductDto[] {
    if (!entities?.map) return;
    return entities.map((entity) => this.fromEntity(entity));
  }
}
