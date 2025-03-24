import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity({ tableName: 'auth_roles_permissions' })
export class RolePermission {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({
    fieldName: 'role_id',
    entity: () => Role,
    updateRule: 'cascade',
    deleteRule: 'no action',
  })
  role: Role;

  @ManyToOne({
    fieldName: 'permission_id',
    entity: () => Permission,
    updateRule: 'cascade',
    deleteRule: 'no action',
  })
  permission: Permission;
}
