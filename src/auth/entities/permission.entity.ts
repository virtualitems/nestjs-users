import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserPermission } from './user-permission.entity';
import { User } from './user.entity';
import { Group } from './group.entity';
import { GroupPermission } from './group-permission.entity';

@Entity({ tableName: 'auth_permissions' })
export class Permission {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @Property({ fieldName: 'slug', unique: true })
  slug!: string;

  @Property({ fieldName: 'description' })
  description!: string;

  @ManyToMany({
    entity: () => User,
    pivotEntity: () => UserPermission,
    mappedBy: 'permissions',
  })
  users = new Collection<User>(this);

  @ManyToMany({
    entity: () => Group,
    pivotEntity: () => GroupPermission,
    mappedBy: 'permissions',
  })
  groups = new Collection<Group>(this);
}
