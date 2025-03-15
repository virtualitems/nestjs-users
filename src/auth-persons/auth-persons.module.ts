import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../auth/providers/users.service';
import { PersonsModule } from '../persons/persons.module';
import { PersonsService } from '../persons/providers/persons.service';
import { AuthPersonsController } from './controllers/auth-persons.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Person } from '../persons/entities/person.entity';
import { User } from '../auth/entities/user.entity';
import { PersonUser } from './entities/persons-users.entity';
import { AuthPersonsService } from './providers/auth-persons.service';

@Module({
  imports: [
    AuthModule,
    PersonsModule,
    MikroOrmModule.forFeature({
      entities: [Person, User, PersonUser],
    }),
  ],
  controllers: [AuthPersonsController],
  providers: [UsersService, PersonsService, AuthPersonsService],
})
export class AuthPersonsModule {}
