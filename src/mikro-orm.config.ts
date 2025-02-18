import { Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';

const config: Options = {
  entities: ['./dist/auth/entities/*.js'],
  entitiesTs: ['./src/auth/entities/*.ts'],
  dbName: 'db.sqlite3',
  migrations: {
    path: './migrations'
  },
  driver: SqliteDriver,
};

export default config;
