import { IsString, MinLength } from 'class-validator';

export class SetupDTO {
  @IsString()
  @MinLength(3)
  public userEmail: string;

  @IsString()
  @MinLength(8)
  public userPassword: string;
}
