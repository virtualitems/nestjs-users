import { Transform } from 'class-transformer';
import { IsString, IsOptional, Min, IsInt, MinLength } from 'class-validator';

export class ListUsersQueryDTO {
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  q?: string;
}
