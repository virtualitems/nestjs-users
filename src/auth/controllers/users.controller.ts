import { type ServerResponse } from 'node:http';
import * as crypto from 'node:crypto';

import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
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
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { PaginationDTO } from '../../shared/data-objects/pagination.dto';

import { LoginUserDTO } from '../data-objects/login-user.dto';
import { CreateUserDTO } from '../data-objects/create-user.dto';
import { UpdateUserDTO } from '../data-objects/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RefreshTokenInterceptor } from '../interceptors/jwt.interceptor';
import { UsersService } from '../providers/users.service';
import { SecurityService } from '../providers/security.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly securityService: SecurityService,
    protected readonly em: EntityManager,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async list(
    @Query() query: PaginationDTO,
  ): Promise<HttpJsonResponse<object[]>> {
    const { page = 1, limit = 100, q } = query;

    const where: FilterQuery<User> = { deletedAt: null };

    if (q !== undefined) {
      where.email = { $like: `%${q}%` };
    }

    const entities = await this.usersService.list(
      this.em,
      page,
      limit,
      ['id', 'email', 'lastLogin'],
      where,
    );

    return { data: entities };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async show(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object>> {
    const user = await this.usersService.find(
      this.em,
      ['id', 'email', 'lastLogin'],
      { id, deletedAt: null },
    );

    if (user === null) {
      throw new NotFoundException();
    }

    return { data: user };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() body: CreateUserDTO): Promise<void> {
    const existent = await this.usersService.find(this.em, ['id'], {
      email: body.email,
      deletedAt: null,
    });

    if (existent !== null) {
      throw new BadRequestException('User already exists');
    }

    const time = new Date().getTime();

    const data = {
      ...body,
      slug: crypto
        .createHash('md5')
        .update(body.email + time)
        .digest('hex'),
      password: this.securityService.hash(body.password),
      createdAt: new Date(),
    };

    await this.usersService.create(this.em, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDTO,
  ): Promise<void> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('No data provided');
    }

    const existent = await this.usersService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    if (existent === null) {
      throw new NotFoundException();
    }

    const data = { ...body, updatedAt: new Date() };

    if (body.password !== undefined) {
      data.password = this.securityService.hash(body.password);
    }

    await this.usersService.update(this.em, body, { id });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: number): Promise<void> {
    const existent = await this.usersService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    if (existent === null) {
      throw new NotFoundException();
    }

    await this.usersService.remove(this.em, { id });
  }

  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(
    @Body() body: LoginUserDTO,
    @Res() response: ServerResponse,
  ): Promise<void> {
    const user = await this.usersService.find(this.em, ['password'], {
      email: body.email,
      deletedAt: null,
    });

    if (
      user === null ||
      !this.securityService.compare(body.password, user.password)
    ) {
      throw new UnauthorizedException();
    }

    await this.usersService.update(
      this.em,
      { lastLogin: new Date() },
      { id: user.id },
    );

    const token = this.securityService.generateToken({ sub: user.id });

    const authorization = `Bearer ${token}`;

    response.setHeader('Authorization', authorization);
    response.end();
  }

  @Get(':id/permissions')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async permissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const user = await this.usersService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    if (user === null) {
      throw new NotFoundException();
    }

    const collection = await user.permissions.init({
      fields: ['id', 'slug', 'description'],
    });

    return { data: collection.toArray() };
  }

  @Get(':id/groups')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async groups(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const user = await this.usersService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    if (user === null) {
      throw new NotFoundException();
    }

    const collection = await user.groups.load({
      fields: ['id', 'slug', 'description', 'permissions'],
      populate: ['permissions'],
    });

    return { data: collection.toArray() };
  }
}
