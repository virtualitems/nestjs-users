import { IsString, MinLength } from 'class-validator';

export class CreateGroupDTO {
  @IsString()
  @MinLength(3)
  description: string;
}
