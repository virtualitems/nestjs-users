import { Transform } from 'class-transformer';
import { IsString, IsEmail, MinLength, IsDate, IsOptional } from 'class-validator';


export class CreateUserDTO
{
    @IsString()
    @MinLength(2)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @Transform(({ value }) => value ? new Date(value) : undefined)
    @IsOptional()
    @IsDate()
    createdAt?: Date;
}
