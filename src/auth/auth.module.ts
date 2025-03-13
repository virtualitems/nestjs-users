import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { GroupsController } from './controllers/groups.controller';
import { UsersController } from './controllers/users.controller';

import { GroupPermission } from './entities/group-permission.entity';
import { Group } from './entities/group.entity';
import { Permission } from './entities/permission.entity';
import { UserGroup } from './entities/user-group.entity';
import { UserPermission } from './entities/user-permission.entity';
import { User } from './entities/user.entity';

import { GroupsService } from './providers/groups.service';
import { JwtStrategy } from './providers/jwt.strategy';
import { SecurityService } from './providers/security.service';
import { UsersService } from './providers/users.service';
import { PermissionsService } from './providers/permissions.service';

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
      ],
    }),
  ],
  controllers: [UsersController, GroupsController],
  providers: [
    ConfigService,
    GroupsService,
    JwtService,
    JwtStrategy,
    SecurityService,
    UsersService,
    PermissionsService,
  ],
})
export class AuthModule {}
