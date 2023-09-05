import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Headers,
  UnauthorizedException,
  ValidationPipe,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { UserSignInForm } from './dtos/user-sign-in.form';
import { UserSignUpForm } from './dtos/user-sign-up.form';
import { SecurityService } from '../security/security.service';
import { Tokens } from './types/tokens.type';
import { TokensDto } from '../security/dtos/tokens.dto';
import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UserRepo } from '../users/repos/user.repo';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService,
    private readonly refreshTokenRepo: RefreshTokenRepo,
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({
    summary: 'Sign up with userName, email, password and roleId',
  })
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

  @ApiOperation({ summary: 'Sign in with email and password' })
  @Post('sign-in')
  async signIn(@Body(ValidationPipe) body: UserSignInForm) {
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

  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: null,
  })
  @Post('sign-out')
  async signOut(@Headers('Authorization') token: string) {
    if (!token) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    const entity = await this.refreshTokenRepo.getTokenData(token);
    if (!entity) {
      throw new UnauthorizedException('Token invalid');
    }
    const tokenEntity = await this.refreshTokenRepo.deleteRefreshToken(token);
    console.log(tokenEntity);
    return { message: 'Signed out successfully' };
  }

  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  async forgotPassword(
    @Body(new ValidationPipe()) resetDto: ForgotPasswordDto,
  ) {
    return await this.securityService.generateRandomToken(resetDto.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    // comparison of email part in token and resetPassword dto:
    const emailPart = token.slice(10);
    const emailDtoPart = resetPasswordDto.email.match(/^(.*?)@/);

    if (emailDtoPart[1] !== emailPart) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userRepo.getUserByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newPassword = resetPasswordDto.newPassword;
    console.log(newPassword);
    const hashedPassword = await this.securityService.hashData(newPassword);
    await this.authService.resetPassword(user, hashedPassword);
  }

  // @Post('test')
  // @UseGuards(JwtPermissionsGuard)
  // @RestrictRequest(UserPermissions.Restricted)
  // @UseGuards(AuthGuard('jwt-strategy'))
  // test() {
  //     return 'protected endpoint';
  // }
}
