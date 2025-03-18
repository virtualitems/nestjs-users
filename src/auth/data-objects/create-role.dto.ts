import { IsString, MinLength } from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @MinLength(3)
  description: string;
}
