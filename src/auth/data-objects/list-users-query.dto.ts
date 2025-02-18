import { IsString, IsNumber } from 'class-validator';


export class ListUsersQuery
{
    @IsNumber()
    page?: number;

    @IsNumber()
    limit?: number;

    @IsString()
    q?: string;
}
