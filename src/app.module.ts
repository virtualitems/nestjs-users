import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AuthPersonsModule } from './auth-persons/auth-persons.module';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from './mikro-orm.config';
import { SetupModule } from './setup/setup.module';
import { SettingsModule } from './settings/settings.module';

const configModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
};

@Module({
  imports: [
    AuthModule,
    AuthPersonsModule,
    ConfigModule.forRoot(configModuleOptions),
    MikroOrmModule.forRoot(mikroOrmConfig),
    SetupModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [JwtService],
})
export class AppModule {}
