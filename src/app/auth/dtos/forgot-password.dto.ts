import {IsEmail} from 'class-validator';
import {ErrorCodes} from '../../../shared/enums/error-codes.enum';

export class ForgotPasswordDto {
    @IsEmail(undefined, {message: ErrorCodes.FieldShouldBeEmail})
    email: string;
}
