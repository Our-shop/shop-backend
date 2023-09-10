import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ErrorCodes } from '../../../shared/enums/error-codes.enum';

export class ResetPasswordDto {
    @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
    email: string;

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
    newPassword: string;
}
