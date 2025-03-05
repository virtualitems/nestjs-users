import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Person } from '../../persons/entities/person.entity';

@Entity({ tableName: 'auth_users' })
export class User {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @Property({ fieldName: 'email', unique: true })
  email!: string;

  @Property({ fieldName: 'password' })
  password!: string;

  @OneToOne(() => Person)
  person!: Person;

  @Property({ fieldName: 'last_login', nullable: true })
  lastLogin?: Date;

  @Property({ fieldName: 'created_at', nullable: true })
  createdAt?: Date;

  @Property({ fieldName: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
