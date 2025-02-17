import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';


@Controller('users')
export class UsersController {

    @Get()
    getUsers(): string {
        return 'Get all';
    }

    @Get(':id')
    getUser(@Param('id') id: string): string {
        return `Get ${id}`;
    }

    @Post()
    createUser(@Body() body: any): string {
        return `Post ${body}`;
    }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() body: any): string {
        return `Put ${id} ${body}`;
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string): string {
        return `Delete ${id}`;
    }

}
