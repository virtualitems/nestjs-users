import { defineConfig } from '@mikro-orm/postgresql';
import { env } from './shared/env';

export default defineConfig({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT),
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  dbName: env.DATABASE_NAME,
  migrations: {
    path: './db/migrations',
  },
  seeder: {
    path: './db/seeders',
  },
  charset: 'UTF8',
  collate: 'es_ES.UTF-8',
});
