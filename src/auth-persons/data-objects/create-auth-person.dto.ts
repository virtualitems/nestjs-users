import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthPersonDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsOptional()
  avatar?: Express.Multer.File;
}
