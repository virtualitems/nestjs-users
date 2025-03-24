import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { PaginationDTO } from '../../shared/data-objects/pagination.dto';
import { JwtAuthGuard, Permissions } from '../../shared/providers/jwt.guard';
import { RefreshTokenInterceptor } from '../../shared/providers/jwt.interceptor';
import { permissions } from '../constants/permissions';
import { Permission } from '../entities/permission.entity';
import { PermissionsService } from '../providers/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(
    protected readonly permissionsService: PermissionsService,
    protected readonly em: EntityManager,
  ) {}

  @Get()
  @Permissions(permissions.PERMISSIONS_LIST)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async list(
    @Query() query: PaginationDTO,
  ): Promise<HttpJsonResponse<object[]>> {
    const { page = 1, limit = 10, q } = query;

    const where: FilterQuery<Permission> = {};

    if (q !== undefined) {
      where.description = { $like: `%${q}%` };
    }

    const entities = await this.permissionsService.list(this.em, {
      page,
      limit,
      fields: ['id', 'slug', 'description'],
      where,
    });

    return { data: entities };
  }

  @Get(':id/roles')
  @Permissions(permissions.PERMISSIONS_LIST)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async roles(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const permission = await this.permissionsService.find(
      this.em,
      {
        id,
      },
      {
        fields: ['id'],
      },
    );

    if (permission === null) {
      throw new NotFoundException();
    }

    const collection = await permission.roles.init({
      fields: ['id', 'slug', 'description'],
    });

    return { data: collection.toArray() };
  }

  @Get(':id/users')
  @Permissions(permissions.PERMISSIONS_LIST)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async users(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const permission = await this.permissionsService.find(
      this.em,
      {
        id,
      },
      {
        fields: ['id'],
      },
    );

    if (permission === null) {
      throw new NotFoundException();
    }

    const collection = await permission.users.init({
      fields: ['id', 'slug', 'email'],
    });

    return { data: collection.toArray() };
  }
}
