import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Person } from './entities/person.entity';
import { PersonsService } from './providers/persons.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Person],
    }),
  ],
  controllers: [],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}
