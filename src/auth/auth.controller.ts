import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { User } from './entities/user';


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
    async create(@Body() data: CreateUserDTO): Promise<void> {
        await this.authService.create(data);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateUserDTO): Promise<void> {
        await this.authService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number): Promise<void> {
        await this.authService.delete(id);
    }
}
