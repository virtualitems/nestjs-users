import { createHash } from 'node:crypto';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityManager,
  EntityRepository,
  FilterQuery,
} from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { JwtPayload } from '../jwt/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async listAll(
    page = 1,
    limit = 10,
    q?: string,
  ): Promise<Partial<User>[]> {
    const offset = (page - 1) * limit;

    const where: FilterQuery<User> = { deletedAt: null };

    if (q !== undefined) {
      where.email = { $like: `%${q}%` };
    }

    const users = await this.repo.findAll({
      fields: ['email'],
      offset,
      limit,
      where,
    });

    return users;
  }

  public async find(filters: Partial<User>): Promise<User | null> {
    return await this.repo.findOne(filters);
  }

  public async show(filters: Partial<User>): Promise<Partial<User> | null> {
    const user = await this.repo.findOne(filters, {
      fields: ['email'],
    });
    return user;
  }

  public async create(em: EntityManager, data: User): Promise<void> {
    const entity = this.repo.create({
      ...data,
      password: data.password && this.hashPassword(data.password),
      createdAt: new Date(),
    });

    await em.persist(entity).flush();
  }

  public async update(em: EntityManager, user: User): Promise<void> {
    await em.persist(user).flush();
  }

  public async delete(em: EntityManager, user: User): Promise<void> {
    user.deletedAt = new Date();
    await em.persist(user).flush();
  }

  public async authenticate(email: string, password: string): Promise<User> {
    const hash = this.hashPassword(password);

    const user = await this.repo.findOneOrFail({
      email,
      password: hash,
      deletedAt: null,
    });

    return user;
  }

  public generateJWT(user: User): string {
    const payload: JwtPayload = { sub: user.id };
    return this.jwtService.sign(payload);
  }

  public refreshJWT(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  public hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
