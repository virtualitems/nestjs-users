import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsService {
  public async list(
    em: EntityManager,
    options?: {
      fields?: (keyof Permission)[];
      where?: FilterQuery<Permission>;
    },
  ): Promise<Permission[]> {
    const entities = await em.findAll(Permission, options);

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
    return entity;
  }
}
