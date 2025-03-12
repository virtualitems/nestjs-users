import {
  RequiredEntityData,
  type EntityManager,
  type FilterQuery,
} from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  public async list(
    em: EntityManager,
    page: number,
    limit: number,
    fields: (keyof User)[],
    where?: FilterQuery<User>,
  ): Promise<Partial<User>[]> {
    if (page < 1) {
      throw new Error('Invalid page number');
    }

    if (limit < 1) {
      throw new Error('Invalid limit number');
    }

    const offset = (page - 1) * limit;

    const entities = await em.findAll(User, {
      fields,
      offset,
      limit,
      where,
    });

    return entities;
  }

  public async find(
    em: EntityManager,
    fields: (keyof User)[],
    where: FilterQuery<User>,
  ): Promise<User | null> {
    const entity = await em.findOne(User, where, { fields });
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
