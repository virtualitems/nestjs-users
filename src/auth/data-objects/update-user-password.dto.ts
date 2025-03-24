import { IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDTO {
  @IsString()
  @MinLength(8)
  password: string;
}
