import { IsArray, IsNumber } from 'class-validator';

export class SaveUserRolesDTO {
  @IsArray()
  @IsNumber({}, { each: true })
  roles: number[];
}
