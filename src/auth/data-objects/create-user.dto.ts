import { IsString, IsEmail, MinLength, IsDate } from 'class-validator';


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

    @IsDate()
    createdAt?: Date;
}
