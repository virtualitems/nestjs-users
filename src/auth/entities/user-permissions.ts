import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Permission } from './permission';
import { User } from './user';


@Entity({ tableName: 'auth_user_permissions' })
export class UserPermissions
{
    @PrimaryKey({ fieldName: 'id' })
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Permission)
    permission!: Permission;
}
