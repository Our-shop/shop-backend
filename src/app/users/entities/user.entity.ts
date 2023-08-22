import {Entity, ManyToOne, OneToMany, Property, Unique} from '@mikro-orm/core';
import { UserRepo } from '../repos/user.repo';
import { BasicEntity } from '../../../shared/entities/basic.entity';
import {UserRoleEntity} from '../../user-roles/entities/user-role.entity';
import {OrderEntity} from '../../orders/entities/order.entity';
import {DeliveryEntity} from '../../delivery/entities/delivery.entity';

@Unique({ properties: ['email'] })
@Entity({ tableName: 'users', customRepository: () => UserRepo })
export class UserEntity extends BasicEntity {
  @Property({ name: 'user_name' })
  userName!: string;

  @Property({ name: 'password' })
  password!: string;

  @Property({ name: 'email' })
  email!: string;

  @Property({ name: "role_id" })
  roleId!: string;

  // @Property({ name: 'refresh_token' })
  // refreshToken!: string;

  @ManyToOne({
    entity: () => UserRoleEntity,
    inversedBy: (e) => e.users,
    joinColumns: ['role_id'],
    referencedColumnNames: ['id'],
    nullable: true,
    lazy: true,
  })
  role?: UserRoleEntity;

  @OneToMany(() => OrderEntity, (e) => e.user)
  orders?: OrderEntity[];

  @OneToMany(() => DeliveryEntity, (e) => e.user)
  deliveries?: DeliveryEntity[];
}
