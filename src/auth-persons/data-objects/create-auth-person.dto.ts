import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateAuthPersonDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(3)
  name!: string;
}
