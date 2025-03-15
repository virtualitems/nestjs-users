import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { PaginationDTO } from '../../shared/data-objects/pagination.dto';
import { JwtAuthGuard, Permissions } from '../guards/jwt.guard';
import { RefreshTokenInterceptor } from '../interceptors/jwt.interceptor';
import { PermissionsService } from '../providers/permissions.service';
import { permissions } from '../constants/permissions';
import { Permission } from '../entities/permission.entity';

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
}
