import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { User } from '../../auth/entities/user.entity';
import { Person } from '../../persons/entities/person.entity';

@Entity({ tableName: 'persons_persons_users' })
export class PersonUser {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({ fieldName: 'user_id', entity: () => User })
  user!: User;

  @ManyToOne({ fieldName: 'person_id', entity: () => Person })
  person!: Person;
}
