import {BadRequestException, Body, Controller, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly securityService: SecurityService
    ) {}

    @ApiOperation({ summary: "Sign up with userName, email, password and roleId" })
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

    @ApiOperation({ summary: "Sign in with email and password" })
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

    @ApiOperation({ summary: 'Refresh tokens' })
    @Post('refresh')
    async refreshTokens(@Body() body: TokensDto): Promise<Tokens> {
        return await this.securityService.refreshTokens(
            body.access_token,
            body.refresh_token,
        );
    }

    @ApiOperation({ summary: "Sign out" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "HttpStatus:200:OK",
        type: null
    })
    @Post("sign-out")
    @UseGuards(JwtPermissionsGuard)
    @RestrictRequest(UserPermissions.SignOut)
    async signOut(@CurrentUser() user: UserSessionDto) {
        return null;
    }

    // @Post('test')
    // @UseGuards(JwtPermissionsGuard)
    // @RestrictRequest(UserPermissions.Restricted)
    // @UseGuards(AuthGuard('jwt-strategy'))
    // test() {
    //     return 'protected endpoint';
    // }
}
