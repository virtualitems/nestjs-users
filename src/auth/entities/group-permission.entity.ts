import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Group } from './group.entity';
import { Permission } from './permission.entity';

@Entity({ tableName: 'auth_groups_permissions' })
export class GroupPermission {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({ fieldName: 'group_id', entity: () => Group })
  group!: Group;

  @ManyToOne({ fieldName: 'group_id', entity: () => Permission })
  permission!: Permission;
}
