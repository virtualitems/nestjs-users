import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MikroOrmModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
