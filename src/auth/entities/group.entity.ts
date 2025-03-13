import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserGroup } from './user-group.entity';
import { User } from './user.entity';

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

  @ManyToMany({
    entity: () => User,
    pivotEntity: () => UserGroup,
  })
  users = new Collection<User>(this);
}
