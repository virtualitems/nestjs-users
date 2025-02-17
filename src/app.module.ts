import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UsersModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
