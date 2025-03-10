import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './jwt/jwt.strategy';
import { PersonsModule } from '../persons/persons.module';
import { AuthService } from './auth.service';
import { GroupPermission } from './permissions/entities/group-permission.entity';
import { Group } from './permissions/entities/group.entity';
import { Permission } from './permissions/entities/permission.entity';
import { UserGroup } from './permissions/entities/user-group.entity';
import { UserPermission } from './permissions/entities/user-permission.entity';
import { User } from './users/entities/user.entity';
import { Person } from 'src/persons/entities/person.entity';
import { UsersController } from './users/users.controller';
import { UserGroupsController } from './permissions/permissions.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES_IN') },
      }),
    }),
    MikroOrmModule.forFeature({
      entities: [
        User,
        Group,
        Permission,
        UserGroup,
        UserPermission,
        GroupPermission,
        Person,
      ],
    }),
    PersonsModule,
  ],
  controllers: [UsersController, UserGroupsController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
