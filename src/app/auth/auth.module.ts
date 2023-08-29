import { Module } from '@nestjs/common';
import {MikroOrmModule} from '@mikro-orm/nestjs';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserEntity} from '../users/entities/user.entity';
import {UserRepo} from '../users/repos/user.repo';
import {SecurityModule} from '../security/security.module';
import {UserRoleEntity} from '../user-roles/entities/user-role.entity';
import {RefreshTokenRepo} from '../refresh-token/repo/refresh-token.repo';
import {RefreshTokenEntity} from '../refresh-token/entity/refresh-token.entity';
import {JwtService} from '@nestjs/jwt';

@Module({
    imports: [
        MikroOrmModule.forFeature({
            entities: [UserEntity, UserRoleEntity, RefreshTokenEntity],
        }),
        SecurityModule
    ],
    providers: [AuthService, UserRepo, RefreshTokenRepo, JwtService],
    controllers: [AuthController],
})
export class AuthModule {}
