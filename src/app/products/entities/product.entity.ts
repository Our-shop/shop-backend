import { Entity, Property, Enum, OneToOne, PrimaryKey } from '@mikro-orm/core';
import { BasicEntity } from '../../../shared/entities/basic.entity';
import { ProductCategories } from '../enums/product-categories.enum';
import { BasicStatuses } from '../../../shared/enums/basic-statuses.enum';

@Entity()
export class ProductEntity extends BasicEntity {
  constructor() {
    super();
    this.status = BasicStatuses.Active; // Set the default status
  }

  @Property({ name: 'title' })
  title!: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'description' })
  description!: string;

  @Property({ name: 'image' })
  image!: string;

  @Property({ name: 'quantity' })
  quantity!: number;

  @Enum({ name: 'category', array: false, items: () => ProductCategories })
  category!: ProductCategories;

  @Property({ name: 'type' })
  type!: string;

  @Property({ name: 'expiration_date', nullable: true })
  expirationDate?: Date;

  @Property({ name: 'size', nullable: true })
  size?: string;

  @Property({ name: 'recommended_age', nullable: true })
  recommendedAge?: number;

  //ADD LINKS HERE...
}
