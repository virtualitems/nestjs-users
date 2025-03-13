import { SqliteDriver } from '@mikro-orm/sqlite';

export default {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'db.sqlite3',
  migrations: {
    path: './db/migrations',
  },
  seeder: {
    path: './db/seeders',
  },
  driver: SqliteDriver,
  charset: 'UTF-8',
  collate: 'UTF-8',
};
