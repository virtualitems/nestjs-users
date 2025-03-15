import {
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Person } from '../entities/person.entity';

@Injectable()
export class PersonsService {
  public async list(
    em: EntityManager,
    options?: {
      page?: number;
      limit?: number;
      fields?: (keyof Person)[];
      where?: FilterQuery<Person>;
    },
  ): Promise<Person[]> {
    if (options === undefined) {
      return await em.findAll(Person, {});
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

    const entities = await em.findAll(Person, queryOptions);

    em.clear();

    return entities;
  }

  public async find(
    em: EntityManager,
    where: FilterQuery<Person>,
    options?: {
      fields: (keyof Person)[];
    },
  ): Promise<Person | null> {
    const entity = await em.findOne(Person, where, options);

    em.clear();

    return entity;
  }

  public async create(em: EntityManager, data: RequiredEntityData<Person>) {
    const entity = em.create(Person, data);
    await em.persist(entity).flush();
  }

  public async update(
    em: EntityManager,
    data: Partial<Person>,
    where: FilterQuery<Person>,
  ) {
    const targets = await em.find(Person, where);

    for (const target of targets) {
      em.assign(target, data);
    }

    await em.flush();
  }

  public async remove(
    em: EntityManager,
    where: FilterQuery<Person>,
  ): Promise<void> {
    const date = new Date();

    const targets = await em.find(Person, where);

    for (const target of targets) {
      em.assign(target, { deletedAt: date });
    }

    await em.flush();
  }
}
