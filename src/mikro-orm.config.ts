import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  host: 'postgres', // docker-compose container name
  // if the database is running on the host machine
  // use host.docker.internal instead of "postgres"
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
