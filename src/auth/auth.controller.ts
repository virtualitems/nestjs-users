import {
    BadRequestException,
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
import { multerConfiguration } from 'src/multer.config';


@Controller('users')
export class AuthController
{
    constructor(private readonly authService: AuthService) { }

    @Get()
    @HttpCode(200)
    public async findAll(): Promise<User[]>
    {
        const users = await this.authService.findAll();
        return users;
    }

    @Get(':id')
    @HttpCode(200)
    public async findOne(@Param('id') id: number): Promise<User | null>
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
    public async create(@Body() data: CreateUserDTO): Promise<void>
    {
        await this.authService.create(data);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', multerConfiguration))
    @HttpCode(201)
    public async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        return {
            message: 'File uploaded successfully',
            filename: file.filename,
            path: file.path
        };
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files', 10, multerConfiguration))
    @HttpCode(201)
    public async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        return {
            message: 'Files uploaded successfully',
            count: files.length,
            files: files
        };
    }

    @Put(':id')
    @HttpCode(204)
    public async update(@Param('id') id: number, @Body() data: UpdateUserDTO): Promise<void>
    {
        await this.authService.update(id, data);
    }

    @Delete(':id')
    @HttpCode(204)
    public async delete(@Param('id') id: number): Promise<void>
    {
        await this.authService.delete(id);
    }

}
