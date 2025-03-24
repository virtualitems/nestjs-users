import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Role } from './role.entity';
import { User } from './user.entity';

@Entity({ tableName: 'auth_users_roles' })
export class UserRole {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({
    fieldName: 'user_id',
    entity: () => User,
    updateRule: 'cascade',
    deleteRule: 'no action',
  })
  user: User;

  @ManyToOne({
    fieldName: 'role_id',
    entity: () => Role,
    updateRule: 'cascade',
    deleteRule: 'no action',
  })
  role: Role;
}
