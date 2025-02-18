import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    UploadedFile,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class AuthController
{
    constructor(private readonly authService: AuthService) { }

    @Get()
    @HttpCode(200)
    async findAll(): Promise<User[]>
    {
        const users = await this.authService.findAll();
        return users;
    }

    @Get(':id')
    @HttpCode(200)
    async findOne(@Param('id') id: number): Promise<User | null>
    {
        const user = await this.authService.findOne(id);

        if (user === null)
        {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @Post()
    @HttpCode(201)
    async create(@Body() data: CreateUserDTO): Promise<void>
    {
        await this.authService.create(data);
    }

    @Post('upload')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File)
    {
        console.log(file);
    }

    @Post('upload-multiple')
    @HttpCode(201)
    @UseInterceptors(FilesInterceptor('files'))
    uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[])
    {
        console.log(files);
    }

    @Put(':id')
    @HttpCode(204)
    async update(@Param('id') id: number, @Body() data: UpdateUserDTO): Promise<void>
    {
        await this.authService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number): Promise<void>
    {
        await this.authService.delete(id);
    }

}
