import { EntityManager, FilterQuery } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsService {
  public async list(
    em: EntityManager,
    fields: (keyof Permission)[],
    where?: FilterQuery<Permission>,
  ): Promise<Permission[]> {
    const entities = await em.findAll(Permission, {
      fields,
      where,
    });

    return entities;
  }

  public async find(
    em: EntityManager,
    fields: (keyof Permission)[],
    where: FilterQuery<Permission>,
  ): Promise<Permission | null> {
    const entity = await em.findOne(Permission, where, { fields });
    return entity;
  }
}
