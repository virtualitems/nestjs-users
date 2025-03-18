import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserPermission } from './user-permission.entity';
import { User } from './user.entity';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';

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
    entity: () => Role,
    pivotEntity: () => RolePermission,
    mappedBy: 'permissions',
  })
  roles = new Collection<Role>(this);
}
