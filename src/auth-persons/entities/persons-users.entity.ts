import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { User } from 'src/auth/entities/user.entity';
import { Person } from 'src/persons/entities/person.entity';

@Entity({ tableName: 'persons_persons_users' })
export class PersonUser {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({ fieldName: 'user_id', entity: () => User })
  user!: User;

  @ManyToOne({ fieldName: 'person_id', entity: () => Person })
  person!: Person;
}
