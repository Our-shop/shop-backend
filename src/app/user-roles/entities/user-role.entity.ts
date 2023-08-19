import {BasicEntity} from '../../../shared/entities/basic.entity';
import {Entity, Enum, EnumType, OneToMany, Property} from '@mikro-orm/core';
import {UserPermissions} from '../enums/user-permissions.enum';
import {UserRoleRepo} from '../repos/user-role.repo';
import {UserRoles} from '../enums/user-roles.enum';
import {UserEntity} from '../../users/entities/user.entity';

@Entity({ tableName: 'user_roles', customRepository: () => UserRoleRepo })
export class UserRoleEntity extends BasicEntity {
    @Property({ name: 'Role type' })
    type!: UserRoles;

    @Enum({
        type: EnumType,
        name: 'permissions',
        array: true,
        items: () => UserPermissions,
    })
    permissions!: UserPermissions[];

    // @Property({ name: 'is_default', type: 'boolean' })
    // isDefault!: boolean;

    @OneToMany(() => UserEntity, (e) => e.role)
    users?: UserEntity[];
}
