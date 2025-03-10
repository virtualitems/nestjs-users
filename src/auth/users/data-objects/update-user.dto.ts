import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
