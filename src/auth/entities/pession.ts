import { Entity, PrimaryKey, Property } from '@mikro-orm/core';


@Entity({ tableName: 'auth_sessions' })
export default class Session
{
    @PrimaryKey({ fieldName: 'session_key' })
    sessionKey!: string;

    @Property({ fieldName: 'session_data' })
    sessionData!: string;

    @Property({ fieldName: 'expire_date' })
    expireDate!: Date;
}
