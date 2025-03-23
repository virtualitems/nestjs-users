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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { PaginationDTO } from '../../shared/data-objects/pagination.dto';
import { JwtAuthGuard, Permissions } from '../../shared/providers/jwt.guard';
import { RefreshTokenInterceptor } from '../../shared/providers/jwt.interceptor';
import { permissions } from '../constants/permissions';
import { CreateRoleDTO } from '../data-objects/create-role.dto';
import { SaveRolesPermissionsDTO } from '../data-objects/save-roles-permissions.dto';
import { UpdateRoleDTO } from '../data-objects/update-role.dto';
import { Role } from '../entities/role.entity';
import { PermissionsService } from '../providers/permissions.service';
import { RolesService } from '../providers/roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    protected readonly rolesService: RolesService,
    protected readonly permissionsService: PermissionsService,
    protected readonly em: EntityManager,
  ) {}

  @Get()
  @Permissions(permissions.ROLES_LIST)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async list(
    @Query() query: PaginationDTO,
  ): Promise<HttpJsonResponse<object[]>> {
    const { page = 1, limit = 10, q } = query;

    const where: FilterQuery<Role> = { deletedAt: null };

    if (q !== undefined) {
      where.description = { $like: `%${q}%` };
    }

    const entities = await this.rolesService.list(this.em, {
      page,
      limit,
      fields: ['id', 'description'],
      where,
    });

    return { data: entities };
  }

  @Get(':id')
  @Permissions(permissions.ROLES_SHOW)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async show(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object>> {
    const entity = await this.rolesService.find(
      this.em,
      { id, deletedAt: null },
      {
        fields: ['id', 'description'],
      },
    );

    if (entity === null) {
      throw new NotFoundException();
    }

    return { data: entity };
  }

  @Post()
  @Permissions(permissions.ROLES_CREATE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() body: CreateRoleDTO): Promise<void> {
    const time = new Date().getTime();
    const data = {
      ...body,
      slug: crypto
        .createHash('md5')
        .update(body.description + time)
        .digest('hex'),
      createdAt: new Date(),
    };

    await this.rolesService.create(this.em, data);
  }

  @Put(':id')
  @Permissions(permissions.ROLES_LIST)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRoleDTO,
  ): Promise<void> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('No data provided');
    }

    const existent = await this.rolesService.find(
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

    await this.rolesService.update(this.em, body, { id });
  }

  @Delete(':id')
  @Permissions(permissions.ROLES_DELETE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    const existent = await this.rolesService.find(
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

    await this.rolesService.remove(this.em, { id });
  }

  @Get(':id/permissions')
  @Permissions(permissions.ROLES_GET_PERMISSIONS)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async permissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const role = await this.rolesService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (role === null) {
      throw new NotFoundException();
    }

    const collection = await role.permissions.init({
      fields: ['id', 'slug', 'description'],
    });

    return { data: collection.toArray() };
  }

  @Post(':id/permissions')
  @Permissions(permissions.ROLES_SET_PERMISSIONS)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async savePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SaveRolesPermissionsDTO,
  ): Promise<void> {
    const role = await this.rolesService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (role === null) {
      throw new NotFoundException();
    }

    const permissions = await this.permissionsService.list(this.em, {
      where: {
        id: { $in: body.permissions },
      },
      fields: ['id'],
    });

    const collection = await role.permissions.init();

    collection.set(permissions);

    await this.em.persistAndFlush(role);
  }

  @Get(':id/users')
  @Permissions(permissions.ROLES_GET_PERMISSIONS)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async users(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const role = await this.rolesService.find(
      this.em,
      {
        id,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (role === null) {
      throw new NotFoundException();
    }

    const collection = await role.users.init({
      fields: ['id', 'slug', 'email'],
    });

    return { data: collection.toArray() };
  }
}
