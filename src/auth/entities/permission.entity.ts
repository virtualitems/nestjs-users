import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserPermission } from './user-permission.entity';
import { User } from './user.entity';

@Entity({ tableName: 'auth_permissions' })
export class Permission {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @Property({ fieldName: 'slug', unique: true })
  slug!: string;

  @Property({ fieldName: 'description' })
  description!: string;

  @ManyToMany({
    entity: () => User,
    pivotEntity: () => UserPermission,
  })
  users = new Collection<User>(this);
}
