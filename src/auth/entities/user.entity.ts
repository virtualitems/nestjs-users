import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'auth_users' })
export class User {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @Property({ fieldName: 'email', index: true })
  email!: string;

  @Property({ fieldName: 'password' })
  password!: string;

  @Property({ fieldName: 'last_login', nullable: true })
  lastLogin?: Date | null;

  @Property({ fieldName: 'created_at', nullable: true })
  createdAt?: Date | null;

  @Property({ fieldName: 'deleted_at', nullable: true, index: true })
  deletedAt?: Date | null;
}
