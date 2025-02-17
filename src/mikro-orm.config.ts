import { Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';

const config: Options = {
  entities: ['./dist/users/users.entities.js'],
  entitiesTs: ['./src/users/users.entities.ts'],
  dbName: 'db.sqlite3',
  migrations: {
    path: './migrations'
  },
  driver: SqliteDriver,
};

export default config;
