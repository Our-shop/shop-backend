import { Module } from '@nestjs/common';
import {JwtModule, JwtService} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import databaseConfig from '../../config/database.config';
import appConfig from '../../config/app.config';

import { UserEntity } from 'src/app/users/entities/user.entity';
import { UserRepo } from 'src/app/users/repos/user.repo';

import { JwtStrategyService } from 'src/app/security/jwt-strategy.service';
import { SecurityService } from 'src/app/security/security.service';
import { ConfigService } from '@nestjs/config';
import { RtStrategy } from './rt-strategy.service';
import {UserRoleRepo} from '../user-roles/repos/user-role.repo';
import {UserRoleEntity} from '../user-roles/entities/user-role.entity';
import {RefreshTokenRepo} from '../refresh-token/repo/refresh-token.repo';
import {RefreshTokenEntity} from '../refresh-token/entity/refresh-token.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-strategy' }),
    JwtModule,
    // JwtModule.registerAsync({
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       // secret: process.env.JWT_SECRET,
    //       // secret: configService.get<string>("app.jwt_secret"),
    //       // signOptions: { expiresIn: '14d' },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    MikroOrmModule.forFeature({
      entities: [UserEntity, UserRoleEntity, RefreshTokenEntity],
    }),
  ],
  providers: [JwtStrategyService, SecurityService, UserRepo, RtStrategy, JwtService, UserRoleRepo, RefreshTokenRepo],
  exports: [SecurityService, PassportModule],
})
export class SecurityModule {}
