import {
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { PersonUser } from '../entities/persons-users.entity';

@Injectable()
export class AuthPersonsService {
  public async list(
    em: EntityManager,
    options?: {
      page?: number;
      limit?: number;
      fields?: (keyof PersonUser)[];
      where?: FilterQuery<PersonUser>;
    },
  ): Promise<PersonUser[]> {
    if (options === undefined) {
      return await em.findAll(PersonUser, {});
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

    const entities = await em.findAll(PersonUser, queryOptions);

    em.clear();

    return entities;
  }

  public async find(
    em: EntityManager,
    where: FilterQuery<PersonUser>,
    options?: {
      fields: (keyof PersonUser)[];
    },
  ): Promise<PersonUser | null> {
    const entity = await em.findOne(PersonUser, where, options);

    em.clear();

    return entity;
  }

  public async create(em: EntityManager, data: RequiredEntityData<PersonUser>) {
    const entity = em.create(PersonUser, data);
    await em.persist(entity).flush();
  }
}
