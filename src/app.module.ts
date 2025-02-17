import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';


@Module({
  imports: [
    UsersModule,
    SharedModule,
    DatabaseModule,
    MikroOrmModule.forRoot({
      entities: ['./dist/users/'],
      entitiesTs: ['./src/users/'],
      dbName: 'db.sqlite3',
      driver: SqliteDriver,
    })
  ],
  controllers: [AppController],
})
export class AppModule {}
