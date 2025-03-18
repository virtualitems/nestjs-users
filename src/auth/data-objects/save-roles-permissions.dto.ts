import { IsArray, IsNumber } from 'class-validator';

export class SaveRolesPermissionsDTO {
  @IsArray()
  @IsNumber({}, { each: true })
  permissions: number[];
}
