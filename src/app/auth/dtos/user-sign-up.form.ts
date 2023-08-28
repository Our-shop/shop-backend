import { IsEmail, IsString, validate } from '@nestjs/class-validator';

import { ErrorCodes } from 'src/shared/enums/error-codes.enum';
import {Matches, MaxLength, MinLength} from 'class-validator';

export class UserSignUpForm {
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  userName!: string;

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

  @IsString({ message: ErrorCodes.FieldShouldBeString })
  roleId!: string;

  static from(form: UserSignUpForm) {
    const it = new UserSignUpForm();
    it.userName = form.userName;
    it.email = form.email;
    it.password = form.password;
    it.roleId = form.roleId;
    return it;
  }

  static async validate(form: UserSignUpForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
