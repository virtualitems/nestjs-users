import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";


@Entity({ tableName: 'auth_groups' })
export class Group
{
    @PrimaryKey({ fieldName: 'id' })
    id!: number;

    @Property({ fieldName: 'name' })
    name!: string;
}


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


@Entity({ tableName: 'auth_permissions' })
export class Permission
{
    @PrimaryKey({ fieldName: 'id' })
    id!: number;

    @Property({ fieldName: 'name' })
    name!: string;
}


@Entity({ tableName: 'auth_users' })
export class User
{
    @PrimaryKey({ fieldName: 'id' })
    id!: number;

    @Property({ fieldName: 'name' })
    name!: string;

    @Property({ fieldName: 'email' })
    email!: string;

    @Property({ fieldName: 'password' })
    password!: string;

    @Property({ fieldName: 'last_login' })
    lastLogin: Date = new Date();

    @Property({ fieldName: 'created_at' })
    createdAt: Date = new Date();

    @Property({ fieldName: 'deleted_at' })
    deletedAt: Date | null = null;
}


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


@Entity({ tableName: 'auth_sessions' })
export class Session
{
    @PrimaryKey({ fieldName: 'session_key' })
    sessionKey!: string;

    @Property({ fieldName: 'session_data' })
    sessionData!: string;

    @Property({ fieldName: 'expire_date' })
    expireDate!: Date;
}
