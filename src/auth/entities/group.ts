import { Entity, PrimaryKey, Property } from '@mikro-orm/core';


@Entity({ tableName: 'auth_groups' })
export default class Group
{
    @PrimaryKey({ fieldName: 'id' })
    id!: number;

    @Property({ fieldName: 'name' })
    name!: string;
}
