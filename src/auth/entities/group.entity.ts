import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'auth_groups' })
export class Group {
  @PrimaryKey({ fieldName: 'id' })
  id!: number;

  @Property({ fieldName: 'slug', unique: true })
  slug!: string;

  @Property({ fieldName: 'description' })
  description!: string;

  @Property({ fieldName: 'created_at', nullable: true })
  createdAt!: Date;

  @Property({ fieldName: 'deleted_at', nullable: true, index: true })
  deletedAt?: Date;
}
