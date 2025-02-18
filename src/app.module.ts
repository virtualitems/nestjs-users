import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    MikroOrmModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
