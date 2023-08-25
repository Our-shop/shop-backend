import { Module } from '@nestjs/common';
import {MikroOrmModule} from '@mikro-orm/nestjs';
import {UserRoleEntity} from './entities/user-role.entity';
import {UserRolesService} from './user-roles.service';
import {UserRolesController} from './user-roles.controller';
import {UserRoleRepo} from './repos/user-role.repo';

@Module({
    imports: [
        MikroOrmModule.forFeature({
            entities: [UserRoleEntity],
        }),
    ],
    providers: [UserRolesService],
    controllers: [UserRolesController]
})
export class UserRolesModule {}
