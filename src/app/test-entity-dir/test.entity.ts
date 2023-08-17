import { Property, Entity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class TestEntity {
  @Property({ name: 'name' })
  name!: string;

  @PrimaryKey()
  @Property({ name: 'id', unique: true })
  id!: number;
}
