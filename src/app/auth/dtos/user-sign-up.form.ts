import { IsEmail, IsString, validate } from '@nestjs/class-validator';

import { ErrorCodes } from 'src/shared/enums/error-codes.enum';

export class UserSignUpForm {
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  userName!: string;

  @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
  email!: string;

  @IsString({ message: ErrorCodes.FieldShouldBeString })
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
