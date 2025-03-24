import {
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  public async list(
    em: EntityManager,
    options?: {
      page?: number;
      limit?: number;
      fields?: (keyof Role)[];
      where?: FilterQuery<Role>;
    },
  ): Promise<Role[]> {
    if (options === undefined) {
      return await em.findAll(Role, {});
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

    const entities = await em.findAll(Role, queryOptions);

    em.clear();

    return entities;
  }

  public async find(
    em: EntityManager,
    where: FilterQuery<Role>,
    options?: {
      fields: (keyof Role)[];
    },
  ): Promise<Role | null> {
    const entity = await em.findOne(Role, where, options);

    em.clear();

    return entity;
  }

  public async create(
    em: EntityManager,
    data: RequiredEntityData<Role>,
  ): Promise<Role> {
    const entity = em.create(Role, data);
    await em.persist(entity).flush();
    return entity;
  }

  public async update(
    em: EntityManager,
    data: Partial<Role>,
    where: FilterQuery<Role>,
  ) {
    const targets = await em.find(Role, where);

    for (const target of targets) {
      em.assign(target, data);
    }

    await em.flush();
  }

  public async remove(
    em: EntityManager,
    where: FilterQuery<Role>,
  ): Promise<void> {
    const date = new Date();

    const targets = await em.find(Role, where);

    for (const target of targets) {
      em.assign(target, { deletedAt: date });
    }

    await em.flush();
  }
}
