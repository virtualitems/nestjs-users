import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'persons_persons' })
export class Person {
  @PrimaryKey()
  id?: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property()
  createdAt?: Date = new Date();
}
