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
import { CreateGroupDTO } from '../data-objects/create-group.dto';
import { UpdateGroupDTO } from '../data-objects/update-group.dto';
import { GroupsService } from '../providers/groups.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RefreshTokenInterceptor } from '../interceptors/jwt.interceptor';
import { Group } from '../entities/group.entity';
import { PermissionsService } from '../providers/permissions.service';
import { SaveGroupsPermissionsDTO } from '../data-objects/save-groups-permissions.dto';

@Controller('groups')
export class GroupsController {
  constructor(
    protected readonly groupsService: GroupsService,
    protected readonly permissionsService: PermissionsService,
    protected readonly em: EntityManager,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async list(
    @Query() query: PaginationDTO,
  ): Promise<HttpJsonResponse<object[]>> {
    const { page = 1, limit = 10, q } = query;

    const where: FilterQuery<Group> = { deletedAt: null };

    if (q !== undefined) {
      where.description = { $like: `%${q}%` };
    }

    const entities = await this.groupsService.list(
      this.em,
      page,
      limit,
      ['id', 'description'],
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
    const entity = await this.groupsService.find(
      this.em,
      ['id', 'description'],
      { id, deletedAt: null },
    );

    if (entity === null) {
      throw new NotFoundException();
    }

    return { data: entity };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() body: CreateGroupDTO): Promise<void> {
    const time = new Date().getTime();
    const data = {
      ...body,
      slug: crypto
        .createHash('md5')
        .update(body.description + time)
        .digest('hex'),
      createdAt: new Date(),
    };

    await this.groupsService.create(this.em, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGroupDTO,
  ): Promise<void> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('No data provided');
    }

    const existent = await this.groupsService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    if (existent === null) {
      throw new NotFoundException();
    }

    await this.groupsService.update(this.em, body, { id });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    const existent = await this.groupsService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    console.log(existent);

    if (existent === null) {
      throw new NotFoundException();
    }

    await this.groupsService.remove(this.em, { id });
  }

  @Get(':id/permissions')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public async permissions(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpJsonResponse<object[]>> {
    const entity = await this.groupsService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    if (entity === null) {
      throw new NotFoundException();
    }

    const collection = await entity.permissions.init({
      fields: ['id', 'slug', 'description'],
    });

    return { data: collection.toArray() };
  }

  @Post(':id/permissions')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async savePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SaveGroupsPermissionsDTO,
  ): Promise<void> {
    const group = await this.groupsService.find(this.em, ['id'], {
      id,
      deletedAt: null,
    });

    if (group === null) {
      throw new NotFoundException();
    }

    const permissions = await this.permissionsService.list(this.em, ['id'], {
      id: { $in: body.permissions },
    });

    const collection = await group.permissions.init();

    collection.set(permissions);

    await this.em.persistAndFlush(group);
  }
}
