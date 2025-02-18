import { Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';

const config: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'db.sqlite3',
  migrations: {
    path: './migrations'
  },
  driver: SqliteDriver,
};

export default config;
