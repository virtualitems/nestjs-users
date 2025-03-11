import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Group } from './group.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ tableName: 'auth_user_groups' })
export class UserGroup {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Group)
  group!: Group;
}
