import {BadRequestException, Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {UserSignInForm} from './dtos/user-sign-in.form';
import {JwtTokenDto} from '../security/dtos/jwt-token.dto';
import {AuthGuard} from '@nestjs/passport';
import {JwtPermissionsGuard} from '../security/guards/jwt-permissions.guard';
import {UserSignUpForm} from './dtos/user-sign-up.form';
import {JwtGuard} from '../security/guards/jwt-auth-guard';
import {SecurityService} from '../security/security.service';
import {Tokens} from './types/tokens.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly securityService: SecurityService
    ) {}

    @ApiOperation({ summary: 'Sign up for user' })
    @Post('sign-up')
    async signUp(@Body() body: UserSignUpForm): Promise<Tokens> {
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

    @ApiOperation({ summary: 'Sign in for user' })
    // @UseGuards(AuthGuard('jwt-strategy'))
    @Post('sign-in')
    async signIn(@Body() body: UserSignInForm){
        const dto = UserSignInForm.from(body);
        const errors = await UserSignInForm.validate(dto);
        if (errors) {
            throw new BadRequestException({
                message: ErrorCodes.InvalidForm,
                errors,
            });
        }

        // return await this.authService.signIn(dto);
    }

    // @UseGuards(AuthGuard('jwt-strategy'))
    // @Post('logout')
    // async logout(@CurrentUser() user: UserSessionDto) {
    //     return await this.authService.logout(user.id);
    // }

    @UseGuards(JwtGuard)
    @Post('refresh')
    refreshTokens(@Req() req) {
        console.log(req);
        return this.authService.refreshTokens(req.user, req.user.refreshToken);
    }

    // @Post('test')
    // @UseGuards(JwtPermissionsGuard)
    // @RestrictRequest(UserPermissions.Restricted)
    // @UseGuards(AuthGuard('jwt-strategy'))
    // test() {
    //     return 'protected endpoint';
    // }
}
