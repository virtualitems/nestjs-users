import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { Group } from './group';
import { Permission } from './permission';


@Entity({ tableName: 'auth_group_permissions' })
export class GroupPermissions
{
    @PrimaryKey({ fieldName: 'id' })
    id!: number;

    @ManyToOne(() => Group)
    group!: Group;

    @ManyToOne(() => Permission)
    permission!: Permission;
}