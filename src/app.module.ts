import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    MikroOrmModule.forRoot(),
    SharedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
