import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/entities/user.entity';
import { UsersService } from '../auth/providers/users.service';
import { Person } from '../persons/entities/person.entity';
import { PersonsModule } from '../persons/persons.module';
import { PersonsService } from '../persons/providers/persons.service';
import { env } from '../shared/env';
import { HashingService } from '../shared/providers/hashing.service';
import { AuthPersonsController } from './controllers/auth-persons.controller';
import { PersonUser } from './entities/persons-users.entity';
import { AuthPersonsService } from './providers/auth-persons.service';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRATION_TIME },
    }),
    AuthModule,
    PersonsModule,
    MikroOrmModule.forFeature({
      entities: [Person, User, PersonUser],
    }),
  ],
  controllers: [AuthPersonsController],
  providers: [AuthPersonsService, HashingService, PersonsService, UsersService],
})
export class AuthPersonsModule {}
