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
import { AuthService } from './users.service';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { type ServerResponse } from 'node:http';

const urls = routes();

@Controller(namespaces.users)
export class UsersController {
  constructor(
    private readonly authService: AuthService,
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
    const users = await this.authService.listAll(page, limit, q);
    return { data: users };
  }

  @Get(urls.users.showAsJSON.path)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async show(
    @Param('id') id: number,
  ): Promise<HttpJsonResponse<Partial<User>>> {
    const user = await this.authService.show({ id });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    return { data: user };
  }

  @Post(urls.users.createWithJSON.path)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() data: CreateUserDTO): Promise<void> {
    const existent = await this.authService.find({
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

    await this.authService.create(this.em, user);
  }

  @Put(urls.users.updateWithJSON.path)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('id') id: number,
    @Body() data: UpdateUserDTO,
  ): Promise<void> {
    const user = await this.authService.find({ id, deletedAt: null });

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
      user.password = this.authService.hashPassword(data.password);
    }

    await this.authService.update(this.em, user);
  }

  @Delete(urls.users.delete.path)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: number): Promise<void> {
    const user = await this.authService.find({ id, deletedAt: null });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    await this.authService.delete(this.em, user);
  }

  @Post(urls.users.loginWithJSON.path)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(
    @Body() data: AuthUserDTO,
    @Res() response: ServerResponse,
  ): Promise<void> {
    let user: User;

    try {
      user = await this.authService.authenticate(data.email, data.password);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLogin = new Date();

    await this.authService.update(this.em, user);

    const accessToken = this.authService.generateJWT(user);
    const authorization = `Bearer ${accessToken}`;

    response.setHeader('Authorization', authorization);
    response.end();
  }
}
