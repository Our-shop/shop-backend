import {BadRequestException, Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {UserSignInForm} from './dtos/user-sign-in.form';
import {UserSignUpForm} from './dtos/user-sign-up.form';
import {SecurityService} from '../security/security.service';
import {Tokens} from './types/tokens.type';
import {TokensDto} from '../security/dtos/tokens.dto';

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

        return await this.authService.signIn(dto);
    }

    // @UseGuards(AuthGuard('jwt-strategy'))
    // @Post('logout')
    // async logout(@CurrentUser() user: UserSessionDto) {
    //     return await this.authService.logout(user.id);
    // }

    @ApiOperation({ summary: 'Refresh tokens' })
    @Post('refresh')
    async refreshTokens(@Body() body: TokensDto): Promise<Tokens> {
        return await this.securityService.refreshTokens(
            body.access_token,
            body.refresh_token,
        );
    }

    // @Post('test')
    // @UseGuards(JwtPermissionsGuard)
    // @RestrictRequest(UserPermissions.Restricted)
    // @UseGuards(AuthGuard('jwt-strategy'))
    // test() {
    //     return 'protected endpoint';
    // }
}
