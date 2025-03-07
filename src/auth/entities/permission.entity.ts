import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'auth_permissions' })
export class Permission {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @Property({ fieldName: 'codename' })
  codename!: string;

  @Property({ fieldName: 'description' })
  description!: string;
}
