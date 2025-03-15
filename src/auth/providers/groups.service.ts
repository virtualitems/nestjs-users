import {
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupsService {
  public async list(
    em: EntityManager,
    options?: {
      page?: number;
      limit?: number;
      fields?: (keyof Group)[];
      where?: FilterQuery<Group>;
    },
  ): Promise<Group[]> {
    if (options === undefined) {
      return await em.findAll(Group, {});
    }

    if (options.page !== undefined && options.page < 1) {
      throw new Error('Invalid page number');
    }

    if (options.limit !== undefined && options.limit < 1) {
      throw new Error('Invalid limit number');
    }

    const { page, ...queryOptions } = options;

    if (page !== undefined) {
      queryOptions['offset'] = (page - 1) * (options.limit ?? 10);
    }

    const entities = await em.findAll(Group, queryOptions);

    em.clear();

    return entities;
  }

  public async find(
    em: EntityManager,
    where: FilterQuery<Group>,
    options?: {
      fields: (keyof Group)[];
    },
  ): Promise<Group | null> {
    const entity = await em.findOne(Group, where, options);

    em.clear();

    return entity;
  }

  public async create(em: EntityManager, data: RequiredEntityData<Group>) {
    const entity = em.create(Group, data);
    await em.persist(entity).flush();
  }

  public async update(
    em: EntityManager,
    data: Partial<Group>,
    where: FilterQuery<Group>,
  ) {
    const targets = await em.find(Group, where);

    for (const target of targets) {
      em.assign(target, data);
    }

    await em.flush();
  }

  public async remove(
    em: EntityManager,
    where: FilterQuery<Group>,
  ): Promise<void> {
    const date = new Date();

    const targets = await em.find(Group, where);

    for (const target of targets) {
      em.assign(target, { deletedAt: date });
    }

    await em.flush();
  }
}
