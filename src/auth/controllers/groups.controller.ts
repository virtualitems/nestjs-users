import { EntityManager } from '@mikro-orm/sqlite';
import {
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
} from '@nestjs/common';

import { PaginationDTO } from '../../shared/data-objects/pagination.dto';
import { CreateGroupDTO } from '../data-objects/create-group.dto';
import { UpdateGroupDTO } from '../data-objects/update-group.dto';
import { GroupsService } from '../services/groups.service';

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly em: EntityManager,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async list(@Query() query: PaginationDTO): Promise<object[]> {
    const { page = 1, limit = 10, q } = query;

    const where = { deletedAt: null };

    if (q !== undefined) {
      where['description'] = { $like: `%${q}%` };
    }

    const entities = await this.groupsService.list(
      this.em,
      page,
      limit,
      ['id', 'description'],
      where,
    );

    return entities;
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async show(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const entity = await this.groupsService.find(
      this.em,
      ['id', 'description'],
      { id, deletedAt: null },
    );

    if (entity === null) {
      throw new NotFoundException();
    }

    return entity;
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateGroupDTO): Promise<void> {
    const data = { ...body, createdAt: new Date() };
    await this.groupsService.create(this.em, data);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGroupDTO,
  ): Promise<void> {
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
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
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
}
