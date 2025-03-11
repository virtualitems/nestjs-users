import { EntityManager } from '@mikro-orm/sqlite';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { namespaces, routes } from '../../routes';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { AuthUserDTO } from './data-objects/auth-user.dto';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { PaginationDTO } from '../shared/data-objects/pagination.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { type ServerResponse } from 'node:http';

const urls = routes();

@Controller(namespaces.users)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly em: EntityManager,
  ) {}

  @Get(urls.users.listAsJSON.path)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async list(
    @Query() query: PaginationDTO,
  ): Promise<HttpJsonResponse<Partial<User>[]>> {
    const { page, limit, q } = query;
    const users = await this.usersService.listAll(page, limit, q);
    return { data: users };
  }

  @Get(urls.users.showAsJSON.path)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async show(
    @Param('id') id: number,
  ): Promise<HttpJsonResponse<Partial<User>>> {
    const user = await this.usersService.show({ id });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    return { data: user };
  }

  @Post(urls.users.createWithJSON.path)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() data: CreateUserDTO): Promise<void> {
    const existent = await this.usersService.find({
      email: data.email,
      deletedAt: null,
    });

    if (existent !== null) {
      throw new BadRequestException('User already exists');
    }

    const user: User = {
      email: data.email,
      password: data.password,
    };

    await this.usersService.create(this.em, user);
  }

  @Put(urls.users.updateWithJSON.path)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('id') id: number,
    @Body() data: UpdateUserDTO,
  ): Promise<void> {
    const user = await this.usersService.find({ id, deletedAt: null });

    if (Object.keys(data).length === 0) {
      return;
    }

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      user.email = data.email;
    }

    if (data.password) {
      user.password = this.usersService.hashPassword(data.password);
    }

    await this.usersService.update(this.em, user);
  }

  @Delete(urls.users.delete.path)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: number): Promise<void> {
    const user = await this.usersService.find({ id, deletedAt: null });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.delete(this.em, user);
  }

  @Post(urls.users.loginWithJSON.path)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(
    @Body() data: AuthUserDTO,
    @Res() response: ServerResponse,
  ): Promise<void> {
    let user: User;

    try {
      user = await this.usersService.authenticate(data.email, data.password);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLogin = new Date();

    await this.usersService.update(this.em, user);

    const accessToken = this.usersService.generateJWT(user);
    const authorization = `Bearer ${accessToken}`;

    response.setHeader('Authorization', authorization);
    response.end();
  }
}
