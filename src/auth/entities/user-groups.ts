import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Group } from './group';
import { User } from './user';


@Entity({ tableName: 'auth_user_groups' })
export class UserGroups
{
    @PrimaryKey({ fieldName: 'id' })
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Group)
    group!: Group;
}
