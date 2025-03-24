import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'settings_settings' })
export class Settings {
  @PrimaryKey({ fieldName: 'id' })
  id?: number;

  @Property({ fieldName: 'slug', unique: true })
  slug: string;

  @Property({ fieldName: 'configurations', type: 'json' })
  configurations: string;
}
