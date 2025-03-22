import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthPersonsModule } from './auth-persons/auth-persons.module';
import mikroOrmConfig from './mikro-orm.config';

const configModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
};

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(configModuleOptions),
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthPersonsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
