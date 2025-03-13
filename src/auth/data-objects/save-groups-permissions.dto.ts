import { IsArray, IsNumber } from 'class-validator';

export class SaveGroupsPermissionsDTO {
  @IsArray()
  @IsNumber({}, { each: true })
  permissions: number[];
}
