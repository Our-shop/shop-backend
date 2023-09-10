import { Entity, Property } from '@mikro-orm/core';
import { ProductEntity } from '../../../shared/entities/product.entity';
import { FoodRepo } from '../repos/food.repo';
import { ProductCategories } from '../../../shared/enums/product-categories.enum';

@Entity({
  discriminatorValue: ProductCategories.Food,
  customRepository: () => FoodRepo,
})
export class FoodEntity extends ProductEntity {
  @Property({ name: 'expiration_date' })
  expirationDate!: string;
}
