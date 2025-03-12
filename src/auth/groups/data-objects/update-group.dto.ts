import { IsString, MinLength } from 'class-validator';

export class UpdateGroupDTO {
  @IsString()
  @MinLength(3)
  description?: string;
}
