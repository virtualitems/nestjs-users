import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';

@Entity({ tableName: 'auth_roles' })
export class Role {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @Property({ fieldName: 'slug', unique: true })
  slug!: string;

  @Property({ fieldName: 'description' })
  description!: string;

  @Property({ fieldName: 'created_at', nullable: true })
  createdAt!: Date;

  @Property({ fieldName: 'deleted_at', nullable: true, index: true })
  deletedAt?: Date;

  @ManyToMany({
    entity: () => User,
    pivotEntity: () => UserRole,
    mappedBy: 'roles',
  })
  users = new Collection<User>(this);

  @ManyToMany({
    entity: () => Permission,
    pivotEntity: () => RolePermission,
  })
  permissions = new Collection<Permission>(this);
}
