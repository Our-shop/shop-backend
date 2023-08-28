import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    Post,
    Req,
    UseGuards,
    Headers,
    HttpCode, UnauthorizedException, ValidationPipe, NotFoundException
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {UserSignInForm} from './dtos/user-sign-in.form';
import {UserSignUpForm} from './dtos/user-sign-up.form';
import {SecurityService} from '../security/security.service';
import {Tokens} from './types/tokens.type';
import {TokensDto} from '../security/dtos/tokens.dto';
import {CurrentUser, JwtPermissionsGuard, RestrictRequest} from '../security/guards/jwt-permissions.guard';
import {UserPermissions} from '../user-roles/enums/user-permissions.enum';
import {UserSessionDto} from '../security/dtos/user-session.dto';
import {RefreshTokenRepo} from '../refresh-token/repo/refresh-token.repo';
import {ResetPasswordDto} from './dtos/reset-password.dto';
import {UserRepo} from '../users/repos/user.repo';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly securityService: SecurityService,
        private readonly refreshTokenRepo: RefreshTokenRepo,
        private readonly userRepo: UserRepo,
    ) {}

    @ApiOperation({ summary: "Sign up with userName, email, password and roleId" })
    @Post('sign-up')
    async signUp(@Body(ValidationPipe) body: UserSignUpForm): Promise<Tokens> {
        const dto = UserSignUpForm.from(body);
        const errors = await UserSignUpForm.validate(dto);
        if (errors) {
            throw new BadRequestException({
                message: ErrorCodes.InvalidForm,
                errors,
            });
        }
        return await this.authService.signUp(dto);
    }

    @ApiOperation({ summary: "Sign in with email and password" })
    @Post('sign-in')
    async signIn(@Body(ValidationPipe) body: UserSignInForm){
        const dto = UserSignInForm.from(body);
        const errors = await UserSignInForm.validate(dto);
        if (errors) {
            throw new BadRequestException({
                message: ErrorCodes.InvalidForm,
                errors,
            });
        }

        return await this.authService.signIn(dto);
    }

    @ApiOperation({ summary: 'Refresh tokens' })
    @Post('refresh')
    async refreshTokens(@Body() body: TokensDto): Promise<Tokens> {
        return await this.securityService.refreshTokens(
            body.access_token,
            body.refresh_token,
        );
    }

    // @Post("sign-out")
    // // @UseGuards(JwtPermissionsGuard)
    // // @RestrictRequest(UserPermissions.SignOut)
    // async signOut(@CurrentUser() user: UserSessionDto) {
    //     console.log(user);
    //     return null;
    // }

    @ApiOperation({ summary: "Sign out" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "HttpStatus:200:OK",
        type: null
    })
    @Post('sign-out')
    async signOut(@Headers('Authorization') token: string) {
        if (!token) {
            throw new UnauthorizedException('Refresh token is missing');
        }
        const entity = await this.refreshTokenRepo.getTokenData(token);
        //console.log('entity' + entity);
        if (!entity) {
            throw new UnauthorizedException('Token invalid');
        }
        const tokenEntity = await this.refreshTokenRepo.deleteRefreshToken(token);
        //console.log(tokenEntity);
        return { message: 'Signed out successfully' };
    }

    @ApiOperation({ summary: "Reset password" })
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        const { email, newPassword } = resetPasswordDto;

        const user = await this.userRepo.getUserByEmail(email);

        if (!user) {
            throw new NotFoundException({
                message: ErrorCodes.NotExists_User
            });
        }

        await this.authService.resetPassword(user, newPassword);

        return { message: 'Password reset successfully' };
    }

    // @Post('test')
    // @UseGuards(JwtPermissionsGuard)
    // @RestrictRequest(UserPermissions.Restricted)
    // @UseGuards(AuthGuard('jwt-strategy'))
    // test() {
    //     return 'protected endpoint';
    // }
}
