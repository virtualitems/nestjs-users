import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import User from './entities/user';


@Controller('users')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return await this.authService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User | null> {
        return await this.authService.findOne(id);
    }

    @Post()
    @HttpCode(201)
    async create(@Body() user: User): Promise<void> {
        await this.authService.create(user);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() user: User): Promise<void> {
        await this.authService.update(id, user);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number): Promise<void> {
        await this.authService.delete(id);
    }
}
