import { Entity, Property } from '@mikro-orm/core';
import { ProductEntity } from '../../../shared/entities/product.entity';
import { ClothesRepo } from '../repos/clothes.repo';
import { ProductCategories } from '../../../shared/enums/product-categories.enum';

@Entity({
  discriminatorValue: ProductCategories.Clothes,
  customRepository: () => ClothesRepo,
})
export class ClothesEntity extends ProductEntity {
  @Property({ name: 'size' })
  size!: string;
}
