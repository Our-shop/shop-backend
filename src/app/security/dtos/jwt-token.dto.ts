import { IsJWT } from 'class-validator';

export class JwtTokenDto {
  @IsJWT()
  access_token: string;
}
