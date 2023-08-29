import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserEntity } from 'src/app/users/entities/user.entity';
import { UserRepo } from 'src/app/users/repos/user.repo';
import { JwtStrategyService } from 'src/app/security/jwt-strategy.service';
import { SecurityService } from 'src/app/security/security.service';
import { RtStrategy } from './rt-strategy.service';
import { UserRoleRepo } from '../user-roles/repos/user-role.repo';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { RefreshTokenEntity } from '../refresh-token/entity/refresh-token.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-strategy' }),
    JwtModule,
    MikroOrmModule.forFeature({
      entities: [UserEntity, UserRoleEntity, RefreshTokenEntity],
    }),
  ],
  providers: [JwtStrategyService, SecurityService, UserRepo, RtStrategy, JwtService, UserRoleRepo, RefreshTokenRepo],
  exports: [SecurityService, PassportModule],
})
export class SecurityModule {}
