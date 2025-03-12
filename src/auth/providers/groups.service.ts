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
    page: number,
    limit: number,
    fields: (keyof Group)[],
    where?: FilterQuery<Group>,
  ): Promise<Group[]> {
    if (page < 1) {
      throw new Error('Invalid page number');
    }

    if (limit < 1) {
      throw new Error('Invalid limit number');
    }

    const offset = (page - 1) * limit;

    const entities = await em.findAll(Group, {
      fields,
      offset,
      limit,
      where,
    });

    return entities;
  }

  public async find(
    em: EntityManager,
    fields: (keyof Group)[],
    where: FilterQuery<Group>,
  ): Promise<Group | null> {
    const entity = await em.findOne(Group, where, { fields });
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
