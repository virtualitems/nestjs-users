import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'auth_groups' })
export class Group {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @Property({ fieldName: 'name' })
  name!: string;
}
