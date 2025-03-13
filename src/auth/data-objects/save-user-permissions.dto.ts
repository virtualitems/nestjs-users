import { IsArray, IsNumber } from 'class-validator';

export class SaveUserPermissionsDTO {
  @IsArray()
  @IsNumber({}, { each: true })
  permissions: number[];
}
