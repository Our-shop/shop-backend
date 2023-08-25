import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';

import {UserRepo} from '../users/repos/user.repo';
import {UserSignInForm} from './dtos/user-sign-in.form';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {SecurityService} from '../security/security.service';
import {UserSignUpForm} from './dtos/user-sign-up.form';
import {Tokens} from './types/tokens.type';


@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly securityService: SecurityService
    ) {}

    async signIn(form: UserSignInForm): Promise<Tokens> {
        const userEntity = await this.userRepo.getUserByEmail(form.email);
        if (!userEntity) {
            throw new BadRequestException({ message: ErrorCodes.NotExists_User });
        }
        const passwordCorrect = await this.securityService.checkPassword(
            form.password,
            userEntity.password,
        );
        if (!passwordCorrect)
            throw new ForbiddenException({ message: ErrorCodes.NotCorrect_Password });

        return await this.securityService.getTokens(userEntity);
    }

    async signUp(form: UserSignUpForm): Promise<Tokens> {
        const found =  await this.userRepo.getUserByEmail(form.email);
        if (found) {
            throw new BadRequestException({ message:ErrorCodes.Exists_User});
        }
        form.password = await this.securityService.hashData(form.password);
        const entity = await this.userRepo.addNewUser(form);
        return await this.securityService.getTokens(entity);
    }

}


