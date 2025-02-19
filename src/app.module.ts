import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import config from './mikro-orm.config';
import { routes } from './routes';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => routes],
    }),
    MikroOrmModule.forRoot(config),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
