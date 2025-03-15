import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Group } from './group.entity';
import { User } from './user.entity';

@Entity({ tableName: 'auth_users_groups' })
export class UserGroup {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @ManyToOne({ fieldName: 'user_id', entity: () => User })
  user!: User;

  @ManyToOne({ fieldName: 'group_id', entity: () => Group })
  group!: Group;
}
