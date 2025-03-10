import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Permission } from './permission.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ tableName: 'auth_user_permissions' })
export class UserPermission {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Permission)
  permission!: Permission;
}
