import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserPermission } from './user-permission.entity';
import { Permission } from './permission.entity';
import { Group } from './group.entity';
import { UserGroup } from './user-group.entity';

@Entity({ tableName: 'auth_users' })
export class User {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @Property({ fieldName: 'slug', unique: true })
  slug!: string;

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

  @ManyToMany({
    entity: () => Permission,
    pivotEntity: () => UserPermission,
  })
  permissions = new Collection<Permission>(this);

  @ManyToMany({
    entity: () => Group,
    pivotEntity: () => UserGroup,
  })
  groups = new Collection<Group>(this);
}
