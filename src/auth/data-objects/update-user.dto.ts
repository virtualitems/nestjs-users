import { Transform } from 'class-transformer';
import { IsString, IsEmail, MinLength, IsDate, IsOptional } from 'class-validator';


export class UpdateUserDTO
{
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @Transform(({ value }) => value ? new Date(value) : undefined)
    @IsOptional()
    @IsDate()
    lastLogin?: Date;

    @Transform(({ value }) => value ? new Date(value) : undefined)
    @IsOptional()
    @IsDate()
    createdAt?: Date;

    @Transform(({ value }) => value ? new Date(value) : undefined)
    @IsOptional()
    @IsDate()
    deletedAt?: Date;
}
