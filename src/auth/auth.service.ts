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
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { ListUsersQueryDTO } from './data-objects/list-users-query.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: EntityRepository<User>,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  public async findAll(query: ListUsersQueryDTO): Promise<Partial<User>[]> {
    const { page = 1, limit = 10, q } = query;

    const offset = (page - 1) * limit;

    const where: FilterQuery<User> = {};

    if (q !== undefined) {
      where.$or = [{ email: { $like: `%${q}%` } }];
    }

    const users = await this.repo.findAll({
      fields: ['id', 'email'],
      offset,
      limit,
      where,
    });

    return users;
  }

  public async findOne(filters: Partial<User>): Promise<Partial<User> | null> {
    const user = await this.repo.findOne(filters, {
      fields: ['id', 'email'],
    });
    return user;
  }

  public async create(data: User): Promise<void> {
    const entity = this.repo.create({
      ...data,
      password: data.password && this.hashPassword(data.password),
      createdAt: new Date(),
    });

    await this.em.persist(entity).flush();
  }

  public async update(id: number, data: UpdateUserDTO): Promise<void> {
    if (data.password !== undefined) {
      data.password = this.hashPassword(data.password);
    }

    await this.repo.nativeUpdate({ id }, data);
  }

  public async delete(id: number): Promise<void> {
    await this.repo.nativeDelete(id);
  }

  public async authenticate(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.repo.findOne({ email });

    if (user === null) {
      return null;
    }

    const isPasswordValid = user.password === this.hashPassword(password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  public async generateJWT(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  protected hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
