import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsService {
  public async list(
    em: EntityManager,
    options?: {
      page?: number;
      limit?: number;
      fields?: (keyof Permission)[];
      where?: FilterQuery<Permission>;
    },
  ): Promise<Permission[]> {
    if (options === undefined) {
      return await em.findAll(Permission);
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

    const entities = await em.findAll(Permission, queryOptions);

    em.clear();

    return entities;
  }

  public async find(
    em: EntityManager,
    where: FilterQuery<Permission>,
    options?: {
      fields: (keyof Permission)[];
    },
  ): Promise<Permission | null> {
    const entity = await em.findOne(Permission, where, options);

    em.clear();

    return entity;
  }
}
