import { IsEmail, IsString, validate } from '@nestjs/class-validator';

import { ErrorCodes } from 'src/shared/enums/error-codes.enum';
import {Matches, MaxLength, MinLength} from 'class-validator';

export class UserSignInForm {
  @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
  email!: string;

  @IsString({ message: ErrorCodes.FieldShouldBeString })
  @MinLength(6)
  @MaxLength(20)
  @Matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$/,
      {
        message:
            'Password should contain at least 6 characters including:' +
            '* 1 Uppercase letter, ' +
            '* 1 Lowercase letter,  ' +
            '* 1 number or special character',
      },
  )
  password!: string;

  static from(dto: UserSignInForm) {
    const it = new UserSignInForm();
    it.email = dto.email;
    it.password = dto.password;
    return it;
  }

  static async validate(dto: UserSignInForm) {
    const errors = await validate(dto);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
