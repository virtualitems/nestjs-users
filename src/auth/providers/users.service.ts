import {
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { Permission } from '../entities/permission.entity';

/**
 * Service to manage user-related operations.
 */
@Injectable()
export class UsersService {
  /**
   * Lists users with optional pagination and filtering.
   *
   * @param em - The entity manager to use for database operations.
   * @param options - Optional parameters for pagination, field selection, and filtering.
   * @returns A promise that resolves to an array of partial user entities.
   * @throws Error if the page or limit number is invalid.
   */
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

    // queryOptions['lockMode'] = LockMode.PESSIMISTIC_READ;

    const entities = await em.findAll(User, queryOptions);

    em.clear();

    return entities;
  }

  /**
   * Finds a single user based on the provided criteria.
   *
   * @param em - The entity manager to use for database operations.
   * @param where - The criteria to find the user.
   * @param options - Optional parameters for field selection.
   * @returns A promise that resolves to the found user entity or null if not found.
   */
  public async find(
    em: EntityManager,
    where: FilterQuery<User>,
    options?: {
      fields?: (keyof User)[];
      populate?: (keyof User)[];
    },
  ): Promise<User | null> {
    if (options !== undefined) {
      // options['lockMode'] = LockMode.PESSIMISTIC_READ;
    }

    const entity = await em.findOne(User, where, options);

    em.clear();

    return entity;
  }

  /**
   * Creates a new user entity.
   *
   * @param em - The entity manager to use for database operations.
   * @param data - The data to create the user entity.
   * @returns A promise that resolves to the created user entity.
   */
  public async create(
    em: EntityManager,
    data: RequiredEntityData<User>,
  ): Promise<User> {
    const entity = em.create(User, data);
    await em.persist(entity).flush();
    return entity;
  }

  /**
   * Updates existing user entities based on the provided criteria.
   *
   * @param em - The entity manager to use for database operations.
   * @param data - The data to update the user entities.
   * @param where - The criteria to find the user entities to update.
   * @returns A promise that resolves when the update operation is complete.
   */
  public async update(
    em: EntityManager,
    data: Partial<User>,
    where: FilterQuery<User>,
  ) {
    // LockMode.PESSIMISTIC_WRITE
    const targets = await em.find(User, where);

    for (const target of targets) {
      em.assign(target, data);
    }

    await em.flush();
  }

  /**
   * Soft deletes user entities based on the provided criteria.
   *
   * @param em - The entity manager to use for database operations.
   * @param where - The criteria to find the user entities to delete.
   * @returns A promise that resolves when the delete operation is complete.
   */
  public async remove(
    em: EntityManager,
    where: FilterQuery<User>,
  ): Promise<void> {
    // LockMode.PESSIMISTIC_WRITE
    const date = new Date();

    const targets = await em.find(User, where);

    for (const target of targets) {
      em.assign(target, { deletedAt: date });
    }

    await em.flush();
  }

  /**
   * Retrieves ALL permissions associated with the given user either directly
   * or through roles that the user belongs to.
   *
   * @param em - The EntityManager used for interacting with the database.
   * @param user - The user entity for which permissions are being retrieved.
   * @returns A promise that resolves to an array of Permission objects associated with the user.
   */
  public async permissions(
    em: EntityManager,
    user: User,
  ): Promise<Permission[]> {
    const perms = await em.find(Permission, {
      $or: [{ users: { id: user.id } }, { roles: { users: { id: user.id } } }],
    });

    em.clear();

    return perms;
  }
}
