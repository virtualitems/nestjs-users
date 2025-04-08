import * as crypto from 'node:crypto';

import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
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
import { JwtService } from '@nestjs/jwt';

import { PaginationDTO } from '../../shared/data-objects/pagination.dto';
import { JwtAuthGuard, Permissions } from '../../shared/providers/jwt.guard';
import { RefreshTokenInterceptor } from '../../shared/providers/jwt.interceptor';
import { permissions } from '../constants/permissions';
import { CreateUserDTO } from '../data-objects/create-user.dto';
import { LoginUserDTO } from '../data-objects/login-user.dto';
import { SaveUserPermissionsDTO } from '../data-objects/save-user-permissions.dto';
import { SaveUserRolesDTO } from '../data-objects/save-user-roles.dto';
import { UpdateUserDTO } from '../data-objects/update-user.dto';
import { User } from '../entities/user.entity';
import { HashingService } from '../../shared/providers/hashing.service';
import { PermissionsService } from '../providers/permissions.service';
import { RolesService } from '../providers/roles.service';
import { UsersService } from '../providers/users.service';
import * as idtoken from '../../shared/idtoken';
import { UpdateUserPasswordDTO } from '../data-objects/update-user-password.dto';
import { env } from '../../shared/env';
import { miliseconds } from 'src/shared/numerics';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    protected readonly hashingService: HashingService,
    protected readonly jwtService: JwtService,
    protected readonly permissionsService: PermissionsService,
    protected readonly rolesService: RolesService,
    protected readonly usersService: UsersService,
    protected readonly em: EntityManager,
  ) {}

  @Get()
  @Permissions(permissions.USERS_LIST)
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

    const entities = await this.usersService.list(this.em, {
      page,
      limit,
      fields: ['id', 'email', 'lastLogin'],
      where,
    });

    return { data: entities };
  }

  @Get(':id')
  @Permissions(permissions.USERS_SHOW)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async show(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object>> {
    const user = await this.usersService.find(
      this.em,
      { id, deletedAt: null },
      {
        fields: ['id', 'email', 'lastLogin'],
      },
    );

    if (user === null) {
      throw new NotFoundException();
    }

    return { data: user };
  }

  @Post()
  @Permissions(permissions.USERS_CREATE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() body: CreateUserDTO): Promise<void> {
    const existent = await this.usersService.find(
      this.em,
      {
        email: body.email,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (existent !== null) {
      throw new BadRequestException('User already exists');
    }

    const time = new Date().getTime();

    const data = {
      email: body.email,
      slug: crypto
        .createHash('md5')
        .update(body.email + time)
        .digest('hex'),
      password: this.hashingService.encrypt(body.password),
      jwtVersion: time,
      createdAt: new Date(),
    };

    await this.usersService.create(this.em, data);
  }

  @Put(':id')
  @Permissions(permissions.USERS_UPDATE)
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

    const existent = await this.usersService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (existent === null) {
      throw new NotFoundException();
    }

    const data = { ...body, updatedAt: new Date() };

    if (body.password !== undefined) {
      data.password = this.hashingService.encrypt(body.password);
    }

    await this.usersService.update(this.em, body, { id });
  }

  @Delete(':id')
  @Permissions(permissions.USERS_DELETE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const existent = await this.usersService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (existent === null) {
      throw new NotFoundException();
    }

    await this.usersService.remove(this.em, { id });
  }

  @Post('login')
  @Permissions(permissions.USERS_LOGIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async login(
    @Body() body: LoginUserDTO,
    @Res() response: Response,
  ): Promise<void> {
    const user = await this.usersService.find(
      this.em,
      {
        email: body.email,
        deletedAt: null,
        permissions: { slug: permissions.USERS_LOGIN.toString() },
      },
      {
        fields: ['password', 'jwtVersion'],
      },
    );

    if (
      user === null ||
      !this.hashingService.compare(body.password, user.password)
    ) {
      throw new UnauthorizedException();
    }

    await this.usersService.update(
      this.em,
      { lastLogin: new Date() },
      { id: user.id },
    );

    const perms = await this.usersService.permissions(this.em, user);

    const payload = {
      sub: user.id,
      ver: user.jwtVersion,
      rex: Date.now() + miliseconds(env.JWT_REFRESH_EXPIRATION_TIME),
      per: perms.map((p) => p.slug),
    };

    const token = this.jwtService.sign(payload);

    response.cookie(env.JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: miliseconds(env.JWT_COOKIE_MAX_AGE),
    });

    response.end();
  }

  @Get(':id/permissions')
  @Permissions(permissions.USERS_GET_PERMISSIONS)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async permissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const entity = await this.usersService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (entity === null) {
      throw new NotFoundException();
    }

    const collection = await entity.permissions.init({
      fields: ['id', 'slug', 'description'],
    });

    return { data: collection.toArray() };
  }

  @Post(':id/permissions')
  @Permissions(permissions.USERS_SET_PERMISSIONS)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async savePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SaveUserPermissionsDTO,
  ): Promise<void> {
    const user = await this.usersService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (user === null) {
      throw new NotFoundException();
    }

    const permissions = await this.permissionsService.list(this.em, {
      where: { id: { $in: body.permissions } },
      fields: ['id'],
    });

    const collection = await user.permissions.init();

    collection.set(permissions);

    await this.em.persistAndFlush(user);
  }

  @Get(':id/roles')
  @Permissions(permissions.USERS_GET_ROLES)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async roles(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const entity = await this.usersService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (entity === null) {
      throw new NotFoundException();
    }

    const collection = await entity.roles.init({
      fields: ['id', 'slug', 'description', 'permissions'],
      populate: ['permissions'],
    });

    return { data: collection.toArray() };
  }

  @Post(':id/roles')
  @Permissions(permissions.USERS_SET_ROLES)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async saveRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SaveUserRolesDTO,
  ): Promise<void> {
    const user = await this.usersService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (user === null) {
      throw new NotFoundException();
    }

    const roles = await this.rolesService.list(this.em, {
      fields: ['id', 'slug', 'description'],
      where: { id: { $in: body.roles } },
    });

    const collection = await user.roles.init();

    collection.set(roles);

    await this.em.persistAndFlush(user);
  }

  @Get('activate/:idtoken')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async activate(@Param('idtoken') token: string): Promise<void> {
    let id: string;

    try {
      id = idtoken.retrieve(token, env.USER_ACTIVATION_TOKEN_SECRET);
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.find(
      this.em,
      {
        id: Number(id),
        deletedAt: null,
      },
      {
        fields: ['id', 'isConfirmed'],
      },
    );

    if (user === null) {
      throw new UnauthorizedException();
    }

    user.isConfirmed = true;

    await this.em.persistAndFlush(user);
  }

  @Get('update-password/:idtoken')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async verifyUpdatePassword(
    @Param('idtoken') token: string,
  ): Promise<void> {
    let id: string;

    try {
      id = idtoken.retrieve(token, env.USER_PASSWORD_RESET_TOKEN_SECRET);
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.find(
      this.em,
      {
        id: Number(id),
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (user === null) {
      throw new UnauthorizedException();
    }
  }

  @Post('update-password/:idtoken')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePassword(
    @Param('idtoken') token: string,
    @Body() body: UpdateUserPasswordDTO,
  ): Promise<void> {
    let id: string;

    try {
      id = idtoken.retrieve(token, env.USER_PASSWORD_RESET_TOKEN_SECRET);
    } catch {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.find(this.em, {
      id: Number(id),
      deletedAt: null,
    });

    if (user === null) {
      throw new UnauthorizedException();
    }

    user.password = this.hashingService.encrypt(body.password);

    await this.em.persistAndFlush(user);
  }
}
