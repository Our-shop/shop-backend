import {BadRequestException, Injectable} from '@nestjs/common';
import {UserRepo} from '../users/repos/user.repo';
import {UserEntity} from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {UserSignInForm} from './dtos/user-sign-in.form';
import {ErrorCodes} from '../../shared/enums/error-codes.enum';
import {SecurityService} from '../security/security.service';
import {UserSignUpForm} from './dtos/user-sign-up.form';
import {JwtTokenDto} from '../security/dtos/jwt-token.dto';
import {Tokens} from './types/tokens.type';
import {UserDto} from '../users/dtos/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepo,
        private readonly securityService: SecurityService
    ) {}

    // async validateUserById(id: string) {
    //     return await this.userRepo.getUser(id);
    // }

    async validateUserByEmail(email: string, password: string): Promise<Partial<UserEntity> | null>  {
          const user =  await this.userRepo.getUserByEmail(email);
          if (user && (await bcrypt.compare(password, user.password))) {
              const {password, ...result} = user;
              return result;                                // return user without password
          }
          return null;
    }

    // async signIn(form: UserSignInForm) {
    //     const entity = await this.userRepo.getByEmailAndPassword(form.email, form.password);
    //     if (!entity) {
    //         throw new BadRequestException({ message: ErrorCodes.NotExists_User });
    //     }
    //
    //     return await this.securityService.generateToken(entity);
    // }


    async signUp(form: UserSignUpForm): Promise<Tokens> {
        const found =  await this.userRepo.getUserByEmail(form.email);
        if (found) {
            throw new BadRequestException(ErrorCodes.Exists_User);
        }
        form.password = await this.securityService.hashData(form.password);
        const entity = await this.userRepo.addUser(form);
        return await this.securityService.getTokens(entity);
    }

    async refreshTokens(entity: UserEntity, rt: string){
        // return await this.securityService.refreshTokens(entity, rt);
    }

}



