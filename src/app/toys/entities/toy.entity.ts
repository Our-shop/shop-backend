import { Entity, Property } from '@mikro-orm/core';
import { ProductEntity } from '../../../shared/entities/product.entity';
import { ProductCategories } from '../../../shared/enums/product-categories.enum';
import { ToysRepo } from '../repos/toys.repo';

@Entity({
  discriminatorValue: ProductCategories.Toys,
  customRepository: () => ToysRepo,
})
export class ToyEntity extends ProductEntity {
  @Property({ name: 'recommended_date' })
  recommendedAge!: string;
}
