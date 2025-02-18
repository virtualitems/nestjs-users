import { Transform } from 'class-transformer';
import { IsString, IsOptional, Min, IsInt, MinLength } from 'class-validator';

export class ListUsersQueryDTO
{
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsString()
    @MinLength(1)
    q?: string;
}
