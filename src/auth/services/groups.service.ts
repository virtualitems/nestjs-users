import {
  type EntityManager,
  type FilterQuery,
  type RequiredEntityData,
} from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupsService {
  async list(
    em: EntityManager,
    page: number = 1,
    limit: number = 10,
    fields: (keyof Group)[],
    where?: FilterQuery<Group>,
  ): Promise<Group[]> {
    if (page < 0) {
      throw new Error('Invalid page number');
    }

    if (limit < 0) {
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

  async find(
    em: EntityManager,
    fields: (keyof Group)[],
    where: FilterQuery<Group>,
  ): Promise<Group | null> {
    const entity = await em.findOne(Group, where, { fields });
    return entity;
  }

  async create(em: EntityManager, data: RequiredEntityData<Group>) {
    const entity = em.create(Group, data);
    await em.persist(entity).flush();
  }

  async update(
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

  async remove(em: EntityManager, where: FilterQuery<Group>): Promise<void> {
    const date = new Date();

    const targets = await em.find(Group, where);

    for (const target of targets) {
      em.assign(target, { deletedAt: date });
    }

    await em.flush();
  }
}
