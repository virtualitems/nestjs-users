import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ tableName: 'auth_users_permissions' })
export class UserPermission {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({ fieldName: 'user_id', entity: () => User })
  user!: User;

  @ManyToOne({ fieldName: 'permission_id', entity: () => Permission })
  permission!: Permission;
}
