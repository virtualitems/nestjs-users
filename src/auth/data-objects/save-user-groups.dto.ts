import { IsArray, IsNumber } from 'class-validator';

export class SaveUserGroupsDTO {
  @IsArray()
  @IsNumber({}, { each: true })
  groups: number[];
}
