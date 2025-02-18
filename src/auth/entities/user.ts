import { Entity, PrimaryKey, Property } from '@mikro-orm/core';


@Entity({ tableName: 'auth_users' })
export default class User
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
