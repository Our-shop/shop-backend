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
import { difference, isEmpty, includes } from 'lodash';

import { UserPermissions } from 'src/app/user-roles/enums/user-permissions.enum';
import { UserSessionDto } from 'src/app/security/dtos/user-session.dto';
import { ErrorCodes } from 'src/shared/enums/error-codes.enum';

export const RestrictRequest = (...scopes: UserPermissions[]) =>
  SetMetadata('user_permissions', scopes);

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserSessionDto;
  },
);

@Injectable()
export class JwtPermissionsGuard
  extends AuthGuard('jwt-strategy')
  implements CanActivate {
  protected readonly logger = new Logger('User Permissions Guard');

  protected permissions: UserPermissions[];

  constructor(private readonly reflector: Reflector) {
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
}
//   handleRequest(err: Error, user: UserSessionDto): UserSessionDto {
//     console.log('permissions', this);
//     if (err || !user) {
//       this.logger.error('User is not authorized to perform request');
//       throw err || new UnauthorizedException(ErrorCodes.NotAuthorizedRequest);
//     }
//
//     if (isEmpty(this.permissions)) {
//       return user;
//     }
//
//     if (includes(user.permissions, UserPermissions.All)) {
//       return user;
//     }
//
//     console.log(user);
//     if (difference(this.permissions, user.permissions).length) {
//       this.logger.error('User is not authorized to perform request');
//       throw new UnauthorizedException(ErrorCodes.NotAuthorizedRequest);
//     }
//
//     return user;
//   }
// }
