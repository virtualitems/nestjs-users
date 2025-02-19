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
    Query,
    UnauthorizedException,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { User } from './entities/user.entity';
import { multerConfiguration } from 'src/multer.config';
import { AuthUserDTO } from './data-objects/auth-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ListUsersQueryDTO } from './data-objects/list-users-query.dto';
import { namespaces, routes } from 'src/routes';


const urls = routes('http://localhost:3000'); // BASE_URL


@Controller(namespaces.users)
export class AuthController
{
    constructor(private readonly authService: AuthService) { }

    @Get(urls.users.listAsJSON.path)
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    public async findAll(@Query() query: ListUsersQueryDTO): Promise<Partial<User>[]>
    {
        const users = await this.authService.findAll(query);
        return users;
    }

    @Get(urls.users.showAsJSON.path)
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    public async findOne(@Param('id') id: number): Promise<User | null>
    {
        const user = await this.authService.findOne(id);

        if (user === null) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @Post(urls.users.createWithJSON.path)
    @HttpCode(201)
    public async create(@Body() data: CreateUserDTO): Promise<void>
    {
        await this.authService.create(data);
    }

    @Post(urls.users.createWithXLSX.path)
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file', multerConfiguration))
    @HttpCode(201)
    public async uploadFile(@UploadedFile() file: Express.Multer.File)
    {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        return {
            message: 'File uploaded successfully',
            filename: file.filename,
            path: file.path
        };
    }

    @Post(urls.users.attachmentsWithMultipart.path)
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FilesInterceptor('files', 10, multerConfiguration))
    @HttpCode(201)
    public async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[])
    {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        return {
            message: 'Files uploaded successfully',
            count: files.length,
            files: files
        };
    }

    @Put(urls.users.updateWithJSON.path)
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    public async update(@Param('id') id: number, @Body() data: UpdateUserDTO): Promise<void>
    {
        await this.authService.update(id, data);
    }

    @Delete(urls.users.delete.path)
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(204)
    public async delete(@Param('id') id: number): Promise<void>
    {
        await this.authService.delete(id);
    }

    @Post(urls.users.loginWithJSON.path)
    @HttpCode(200)
    public async login(@Body() data: AuthUserDTO): Promise<object>
    {
        const user = await this.authService.authenticate(data.email, data.password);

        if (user === null) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const access_token = await this.authService.generateJWT(user);
        return { authorization: `Bearer ${access_token}` };
    }

}
