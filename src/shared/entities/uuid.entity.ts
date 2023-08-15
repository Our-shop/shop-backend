import { Entity, PrimaryKey } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export abstract class UUIDEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();
}
