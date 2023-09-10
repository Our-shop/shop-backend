import { Reflector } from '@nestjs/core';
import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
  createParamDecorator,
  CanActivate,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { difference, isEmpty, includes } from 'lodash';

import { UserPermissions } from 'src/app/user-roles/enums/user-permissions.enum';
import { UserSessionDto } from 'src/app/security/dtos/user-session.dto';
import { ErrorCodes } from 'src/shared/enums/error-codes.enum';
import { RefreshTokenRepo } from '../../refresh-token/repo/refresh-token.repo';

export const RestrictRequest = (...scopes: UserPermissions[]) =>
  SetMetadata('user_permissions', scopes);

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

@Injectable()
export class JwtPermissionsGuard
  extends AuthGuard('jwt-strategy')
  implements CanActivate
{
  protected readonly logger = new Logger('User Permissions Guard');

  protected permissions: UserPermissions[];

  constructor(
    private readonly reflector: Reflector, // private readonly i18n: I18nService
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.permissions =
      this.reflector.get<UserPermissions[]>(
        'user_permissions',
        context.getHandler(),
      ) || [];
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  handleRequest(err: Error, user: UserSessionDto): UserSessionDto {
    if (err || !user) {
      this.logger.error('User is not authorized to perform request');
      throw err || new UnauthorizedException(ErrorCodes.NotAuthorizedRequest);
    }

    if (isEmpty(this.permissions)) {
      return user;
    }

    if (includes(user.permissions, UserPermissions.All)) {
      return user;
    }

    if (difference(this.permissions, user.permissions).length) {
      this.logger.error('User is not authorized to perform request');
      throw new UnauthorizedException(ErrorCodes.NotAuthorizedRequest);
    }

    return user;
  }
}
