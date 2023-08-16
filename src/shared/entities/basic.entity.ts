import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { BasicStatuses } from '../enums/basic-statuses.enum';

@Entity({ abstract: true })
export abstract class BasicEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'timestamptz' })
  created: Date = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updated: Date = new Date();

  @Property({ type: 'string' })
  status: BasicStatuses;
}
