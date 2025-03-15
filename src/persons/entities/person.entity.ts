import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'persons_persons' })
export class Person {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @Property({ fieldName: 'name' })
  name!: string;

  @Property({ fieldName: 'avatar', nullable: true })
  avatar?: string;

  @Property({ fieldName: 'created_at', nullable: true })
  createdAt?: Date | null;

  @Property({ fieldName: 'deleted_at', nullable: true, index: true })
  deletedAt?: Date | null;
}
