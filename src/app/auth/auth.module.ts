import { Module } from '@nestjs/common';
import {MikroOrmModule} from '@mikro-orm/nestjs';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserEntity} from '../users/entities/user.entity';
import {UserRepo} from '../users/repos/user.repo';
import {SecurityModule} from '../security/security.module';
import {UserRoleEntity} from '../user-roles/entities/user-role.entity';

@Module({
    imports: [
        MikroOrmModule.forFeature({
            entities: [UserEntity, UserRoleEntity],
        }),
        SecurityModule
    ],
    providers: [AuthService, UserRepo],
    controllers: [AuthController],
})
export class AuthModule {}
