import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  dbName: 'project1',
  migrations: {
    path: './db/migrations',
  },
  seeder: {
    path: './db/seeders',
  },
  charset: 'UTF8',
  collate: 'es_ES.UTF-8',
});
