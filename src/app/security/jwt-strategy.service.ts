import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { SecurityService } from 'src/app/security/security.service';
import { ErrorCodes } from 'src/shared/enums/error-codes.enum';
import { PassportStrategy } from '@nestjs/passport';
import { UserSessionDto } from './dtos/user-session.dto';

@Injectable()
export class JwtStrategyService extends PassportStrategy(
  Strategy,
  'jwt-strategy',
) {
  readonly name = 'jwt-strategy';

  constructor(
    private readonly configService: ConfigService,
    private readonly securityService: SecurityService,
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: configService.get<string>('app.jwt_secret'),
      },
      async (req: Request, payload: UserSessionDto, next: VerifiedCallback) => this.verify(req, payload, next),
    );
  }

  public async verify(req, payload: UserSessionDto, done: VerifiedCallback) {
    console.log(payload, 'payload');
    done(null, payload);
    const user = await this.securityService.getUserById(payload.id);

    if (!user) {
      return done(ErrorCodes.NotExists_User, false);
    }

    done(null, payload);
  }
}
