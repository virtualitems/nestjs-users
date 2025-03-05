import { Injectable } from '@nestjs/common';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/sqlite';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person) private readonly repo: EntityRepository<Person>,
    private readonly em: EntityManager,
  ) {}

  public async create(data: Person): Promise<void> {
    const entity = this.repo.create({
      ...data,
      createdAt: new Date(),
    });

    await this.em.persist(entity).flush();
  }
}
