import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Group } from './group.entity';
import { Permission } from './permission.entity';

@Entity({ tableName: 'auth_group_permissions' })
export class GroupPermission {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @ManyToOne(() => Group)
  group!: Group;

  @ManyToOne(() => Permission)
  permission!: Permission;
}
