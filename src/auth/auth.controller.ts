import * as fs from 'fs';

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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { Person } from '../persons/entities/person.entity';
import { namespaces, routes } from '../routes';
import { multerConfiguration } from '../multer.config';
import { AuthService } from './auth.service';
import { AuthUserDTO } from './data-objects/auth-user.dto';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { ListUsersQueryDTO } from './data-objects/list-users-query.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { User } from './entities/user.entity';
import { PersonsService } from 'src/persons/persons.service';

const urls = routes();

@Controller(namespaces.users)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly personsService: PersonsService,
  ) {}

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
  @UseInterceptors(FileInterceptor('avatar', multerConfiguration))
  public async create(
    @Body() data: CreateUserDTO,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    if (avatar === undefined) {
      throw new BadRequestException('No avatar uploaded');
    }

    const existent = await this.authService.findOne({ email: data.email });

    if (existent !== null) {
      fs.unlinkSync(avatar.path);
      throw new BadRequestException('User already exists');
    }

    const person: Person = { name: data.name, avatar: avatar.path };

    await this.personsService.create(person);

    const user: User = {
      email: data.email,
      password: data.password,
      person: person,
    };

    await this.authService.create(user);
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
