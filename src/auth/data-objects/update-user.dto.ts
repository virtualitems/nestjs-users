import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @Transform(({ value }: { value: string | number | Date }) =>
    value ? new Date(value) : undefined,
  )
  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @Transform(({ value }: { value: string | number | Date }) =>
    value ? new Date(value) : undefined,
  )
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Transform(({ value }: { value: string | number | Date }) =>
    value ? new Date(value) : undefined,
  )
  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
