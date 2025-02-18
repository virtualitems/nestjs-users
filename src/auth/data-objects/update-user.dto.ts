import { IsString, IsEmail, MinLength, IsDate } from 'class-validator';


export class UpdateUserDTO {
    @IsString()
    @MinLength(2)
    name?: string;

    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(8)
    password?: string;

    @IsDate()
    lastLogin?: Date;

    @IsDate()
    createdAt?: Date;

    @IsDate()
    deletedAt?: Date;
}
