import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Person } from './person.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Person],
    }),
  ],
  controllers: [],
  providers: [],
})
export class PersonsModule {}
