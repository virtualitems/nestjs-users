import { IsString, MinLength } from 'class-validator';

export class UpdateRoleDTO {
  @IsString()
  @MinLength(3)
  description?: string;
}
