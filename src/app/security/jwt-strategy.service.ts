import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { SecurityService } from 'src/app/security/security.service';
import { UserSessionDto } from 'src/app/security/dtos/user-session.dto';
import { ErrorCodes } from 'src/shared/enums/error-codes.enum';
import { PassportStrategy } from '@nestjs/passport';

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
        secretOrKey: configService.get<string>('app.rt_jtw_secret'),
      },
      async (req, payload, next) => await this.verify(req, payload, next),
    );
  }

  public async verify(req, payload: UserSessionDto, done) {
    console.log(payload, 'payload');
    const user = await this.securityService.getUserById(payload.id);

    if (!user) {
      return done(ErrorCodes.NotExists_User, false);
    }

    done(null, payload);
  }
}
