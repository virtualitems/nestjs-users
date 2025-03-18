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
import {
  JwtAuthGuard,
  Permissions,
  PermissionsGuard,
} from '../guards/jwt.guard';
import { RefreshTokenInterceptor } from '../interceptors/jwt.interceptor';
import { UsersService } from '../providers/users.service';
import { SecurityService } from '../providers/security.service';
import { User } from '../entities/user.entity';
import { SaveUserPermissionsDTO } from '../data-objects/save-user-permissions.dto';
import { PermissionsService } from '../providers/permissions.service';
import { RolesService } from '../providers/roles.service';
import { SaveUserRolesDTO } from '../data-objects/save-user-roles.dto';
import { JwtPayload } from '../interfaces/jwt.interface';
import { permissions } from '../constants/permissions';

@Controller('users')
export class UsersController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly permissionsService: PermissionsService,
    protected readonly rolesService: RolesService,
    protected readonly securityService: SecurityService,
    protected readonly em: EntityManager,
  ) {}

  @Get()
  @Permissions(permissions.USERS_LIST)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
      ...body,
      slug: crypto
        .createHash('md5')
        .update(body.email + time)
        .digest('hex'),
      password: this.securityService.hash(body.password),
      createdAt: new Date(),
    };

    await this.em.transactional(async (em: EntityManager) => {
      try {
        const user = await this.usersService.create(em, data);
        const perms = await this.permissionsService.list(em, {
          where: {
            slug: {
              $in: [
                permissions.USERS_LOGIN,
                permissions.USERS_CREATE,
                permissions.USERS_GET_PERMISSIONS,
                permissions.USERS_SET_PERMISSIONS,
              ],
            },
          },
        });
        user.permissions.set(perms);
        await em.persist(user).flush();
        await em.commit();
      } catch (error) {
        console.error(error);
        await em.rollback();
      }
    });
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
      data.password = this.securityService.hash(body.password);
    }

    await this.usersService.update(this.em, body, { id });
  }

  @Delete(':id')
  @Permissions(permissions.USERS_DELETE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: number): Promise<void> {
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
    @Res() response: ServerResponse,
  ): Promise<void> {
    const user = await this.usersService.find(
      this.em,
      {
        email: body.email,
        deletedAt: null,
      },
      {
        fields: ['password'],
      },
    );

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

    const permissions = await user.permissions.init({
      fields: ['id'],
    });

    const roles = await user.roles.init({
      fields: ['id'],
    });

    const payload: JwtPayload = {
      sub: user.id,
      pms: permissions.map((item) => item.id!),
      ugs: roles.map((item) => item.id!),
    };

    const token = this.securityService.generateToken(payload);

    const authorization = `Bearer ${token}`;

    response.setHeader('Authorization', authorization);
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
}
