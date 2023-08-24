import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepo } from 'src/app/users/repos/user.repo';
import { UserEntity } from 'src/app/users/entities/user.entity';

import { JwtTokenDto } from 'src/app/security/dtos/jwt-token.dto';
import { UserSessionDto } from 'src/app/security/dtos/user-session.dto';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '../auth/types/tokens.type';

import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  public async getUserById(userId: string) {
    return await this.userRepo.getUser(userId);
  }

  async getTokens(entity: UserEntity): Promise<Tokens> {
    const permissions = await this.userRepo.getUserRoles(entity.id);
    const payload = UserSessionDto.fromEntity(entity, permissions);
    // const user = this.userRepo.findOne({ id: entity.id });

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('app.jwt_secret'),
        expiresIn: this.config.get<number>('app.a_token_expires'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('app.jwt_secret'),
        expiresIn: this.config.get<number>('app.r_token_expires'),
      }),
    ]);
    await this.userRepo.addRefreshToken(entity.id, rt);

    return {
      access_token: at,
      refresh_token: rt,
      at_expiration: this.config.get<number>('app.a_token_expires'),
      rt_expiration: this.config.get<number>('app.r_token_expires')
    };
  }

  // async refreshTokens(entity: UserEntity, rt: string): Promise<Tokens> {
  //   // const user = await this.userRepo.getUser(entity.id);
  //   // if (!user) throw new ForbiddenException('Access Denied');
  //   // // const rtMatches = bcrypt.compare(rt, user.hashedRt);
  //   // // const rtMatches = bcrypt.compare(rt, user.hashedRt);
  //   // if (!rtMatches) throw new ForbiddenException('Access Denied');
  //   //
  //   // const tokens = await this.securityService.getTokens(entity);
  //   // await this.updateRtHash(user.id, tokens.refresh_token);
  //   //
  //   // return tokens;
  // }

  // async generateToken(entity: UserEntity): Promise<JwtTokenDto> {
  //   const userWithRole = await this.userRepo.getUserWithRole(entity.id);
  //   const payload = UserSessionDto.fromEntity(
  //     entity,
  //     userWithRole.role.permissions,
  //   );
  //   const secret = this.config.get<string>('app.jwt_secret');
  //   const access_token = this.jwtService.sign(payload, {secret});
  //
  //   return {
  //     access_token,
  //   } as JwtTokenDto;
  // }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }
}
