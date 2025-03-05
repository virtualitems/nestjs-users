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
  // UploadedFile,
  // UploadedFiles,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';

// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { User } from './entities/user.entity';
// import { multerConfiguration } from 'src/multer.config';
import { AuthUserDTO } from './data-objects/auth-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ListUsersQueryDTO } from './data-objects/list-users-query.dto';
import { namespaces, routes } from '../routes';

const urls = routes();

@Controller(namespaces.users)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(urls.users.listAsJSON.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  public async findAll(
    @Query() query: ListUsersQueryDTO,
  ): Promise<HttpJsonResponse<Partial<User>[]>> {
    const users = await this.authService.findAll(query);
    return { data: users };
  }

  @Get(urls.users.showAsJSON.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  public async findOne(
    @Param('id') id: number,
  ): Promise<HttpJsonResponse<Partial<User>>> {
    const user = await this.authService.findOne({ id });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    return { data: user };
  }

  @Post(urls.users.createWithJSON.path)
  @HttpCode(201)
  public async create(@Body() data: CreateUserDTO): Promise<{ id: number }> {
    const user = await this.authService.findOne({ email: data.email });

    if (user !== null) {
      throw new BadRequestException('User already exists');
    }

    const result = await this.authService.create(data);

    return result;
  }

  // @Post(urls.users.createWithXLSX.path)
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FileInterceptor('file', multerConfiguration))
  // @HttpCode(201)
  // public uploadFile(
  //   @UploadedFile() file: Express.Multer.File,
  // ): HttpJsonResponse {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   return {};
  // }

  // @Post(urls.users.attachmentsWithMultipart.path)
  // @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(FilesInterceptor('files', 10, multerConfiguration))
  // @HttpCode(201)
  // public uploadMultipleFiles(
  //   @UploadedFiles() files: Express.Multer.File[],
  // ): HttpJsonResponse {
  //   if (!files || files.length === 0) {
  //     throw new BadRequestException('No files uploaded');
  //   }

  //   return {};
  // }

  @Put(urls.users.updateWithJSON.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  public async update(
    @Param('id') id: number,
    @Body() data: UpdateUserDTO,
  ): Promise<void> {
    await this.authService.update(id, data);
  }

  @Delete(urls.users.delete.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  public async delete(@Param('id') id: number): Promise<void> {
    await this.authService.delete(id);
  }

  @Post(urls.users.loginWithJSON.path)
  @HttpCode(200)
  public async login(@Body() data: AuthUserDTO): Promise<object> {
    const user = await this.authService.authenticate(data.email, data.password);

    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.authService.generateJWT(user);
    const authorization = `Bearer ${access_token}`;
    return { authorization };
  }
}
