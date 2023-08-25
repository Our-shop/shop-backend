import {Injectable, NotAcceptableException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { UserRepo } from 'src/app/users/repos/user.repo';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { UserSessionDto } from 'src/app/security/dtos/user-session.dto';
import { Tokens } from '../auth/types/tokens.type';
import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';

@Injectable()
export class SecurityService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
    private config: ConfigService,
    private readonly refreshTokenRepo: RefreshTokenRepo,
  ) {}

  public async getUserById(userId: string) {
    return await this.userRepo.getUser(userId);
  }

  async getTokens(entity: UserEntity): Promise<Tokens> {
    const permissions = await this.userRepo.getUserPermissions(entity.id);
    const payload = UserSessionDto.fromEntity(entity, permissions);
    const user = await this.userRepo.findOne({ id: entity.id });

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

    await this.refreshTokenRepo.addRefreshToken(user, rt);

    return {
      access_token: at,
      refresh_token: rt,
      at_expiration: this.config.get<number>('app.a_token_expires'),
      rt_expiration: this.config.get<number>('app.r_token_expires')
    };
  }

  // TODO Check validation logic
    async refreshTokens(accessToken: string, refreshToken: string) {
        const validTokens =
            this.validateAccessToken(accessToken) &&
            (await this.validateRefreshToken(refreshToken));
        if (!validTokens) {
            throw new NotAcceptableException({ message:ErrorCodes.InvalidTokens});
        }

        const accessPayload = this.jwtService.decode(accessToken) as UserSessionDto;

        const user = await this.userRepo.findOne({ id: accessPayload.id });
        return await this.getTokens(user);
    }

    async validateRefreshToken(token: string) {
        const secret = this.config.get<string>('app.jwt_secret');
        try {
            const tokenEntity = await this.refreshTokenRepo.findOne({ refresh_token: token });
            console.log(tokenEntity);
            if (!tokenEntity) {
                return false;
            }
            await this.refreshTokenRepo.nativeDelete({ refresh_token: token });
            const payload = this.jwtService.verify(token, { secret });
            return new Date().getTime() < payload.exp * 1000;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    validateAccessToken(token: string) {
        const secret = this.config.get<string>('app.jwt_secret');
        try {
            const payload = this.jwtService.verify(token, { secret });
            return new Date().getTime() < payload.exp * 1000;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async checkPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}
