import { ProductCategories } from '../enums/product-categories.enum';
import { BasicDto } from './basic.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';
import { ProductTypes } from '../enums/product-types.enum';
import { IsString } from '@nestjs/class-validator';
import { ErrorCodes } from '../enums/error-codes.enum';
import { IsEnum, IsNumber } from 'class-validator';

export class ProductDto extends BasicDto {
  @ApiProperty({
    description: 'Product title',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  title!: string;

  @ApiProperty({
    description: 'Product price',
  })
  @IsNumber()
  price!: number;

  @ApiProperty({
    description: 'Product description',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  description!: string;

  @ApiProperty({
    description: 'Product image url',
  })
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  image!: string;

  @ApiProperty({
    description: 'Product quantity',
  })
  @IsNumber()
  quantity!: number;

  @ApiProperty({
    description: 'Product category',
    enum: ProductCategories,
  })
  @IsEnum(ProductCategories)
  category: ProductCategories;

  @ApiProperty({
    description: 'Product category',
    enum: ProductTypes,
  })
  @IsEnum(ProductTypes)
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
