import { Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';

export const config: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'db.sqlite3',
  migrations: {
    path: './migrations'
  },
  driver: SqliteDriver,
  charset: 'UTF-8',
  collate: 'UTF-8',
};
