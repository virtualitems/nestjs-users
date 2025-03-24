import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ tableName: 'auth_users_permissions' })
export class UserPermission {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({
    fieldName: 'user_id',
    entity: () => User,
    updateRule: 'cascade',
    deleteRule: 'no action',
  })
  user!: User;

  @ManyToOne({
    fieldName: 'permission_id',
    entity: () => Permission,
    updateRule: 'cascade',
    deleteRule: 'no action',
  })
  permission!: Permission;
}
