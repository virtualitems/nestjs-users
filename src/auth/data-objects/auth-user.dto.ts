import { IsString, IsEmail, MinLength } from 'class-validator';

export class AuthUserDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
