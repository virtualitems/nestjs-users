import {
  RequiredEntityData,
  EntityManager,
  FilterQuery,
} from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  public async list(
    em: EntityManager,
    options?: {
      page?: number;
      limit?: number;
      fields?: (keyof User)[];
      where?: FilterQuery<User>;
    },
  ): Promise<Partial<User>[]> {
    if (options === undefined) {
      return await em.findAll(User, {});
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

    const entities = await em.findAll(User, queryOptions);

    em.clear();

    return entities;
  }

  public async find(
    em: EntityManager,
    where: FilterQuery<User>,
    options?: {
      fields: (keyof User)[];
    },
  ): Promise<User | null> {
    const entity = await em.findOne(User, where, options);

    em.clear();

    return entity;
  }

  public async create(
    em: EntityManager,
    data: RequiredEntityData<User>,
  ): Promise<void> {
    const entity = em.create(User, data);
    await em.persist(entity).flush();
  }

  public async update(
    em: EntityManager,
    data: Partial<User>,
    where: FilterQuery<User>,
  ) {
    const targets = await em.find(User, where);

    for (const target of targets) {
      em.assign(target, data);
    }

    await em.flush();
  }

  public async remove(
    em: EntityManager,
    where: FilterQuery<User>,
  ): Promise<void> {
    const date = new Date();

    const targets = await em.find(User, where);

    for (const target of targets) {
      em.assign(target, { deletedAt: date });
    }

    await em.flush();
  }
}
