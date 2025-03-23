import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { HashingService } from '../shared/providers/hashing.service';
import { SetupController } from './controllers/setup.controller';

@Module({
  imports: [AuthModule],
  controllers: [SetupController],
  providers: [HashingService],
})
export class SetupModule {}
