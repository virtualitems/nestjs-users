import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";


@Entity({ tableName: 'auth_groups' })
export class Group
{
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;
}


@Entity({ tableName: 'auth_group_permissions' })
export class GroupPermissions
{
    @PrimaryKey()
    id!: number;

    @ManyToOne()
    group!: Group;

    @ManyToOne(() => Permission)
    permission!: Permission;
}


@Entity({ tableName: 'auth_permissions' })
export class Permission
{
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;
}


@Entity({ tableName: 'auth_users' })
export class User
{
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property()
    email!: string;

    @Property()
    password!: string;

    @Property({ name: 'last_login' })
    lastLogin: Date = new Date();

    @Property({ name: 'created_at' })
    createdAt: Date = new Date();

    @Property({ name: 'deleted_at' })
    deletedAt: Date | null = null;
}


@Entity({ tableName: 'auth_user_groups' })
export class UserGroups
{
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Group)
    group!: Group;
}


@Entity({ tableName: 'auth_user_permissions' })
export class UserPermissions
{
    @PrimaryKey()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Permission)
    permission!: Permission;
}


@Entity({ tableName: 'auth_sessions' })
export class Session
{
    @PrimaryKey({ name: 'session_key' })
    sessionKey!: string;

    @Property({ name: 'session_data' })
    sessionData!: string;

    @Property({ name: 'expire_date' })
    expireDate!: Date;
}
