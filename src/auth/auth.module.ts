import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './jwt/jwt.strategy';
import { GroupPermission } from './permissions/entities/group-permission.entity';
import { Group } from './permissions/entities/group.entity';
import { Permission } from './permissions/entities/permission.entity';
import { UserGroup } from './permissions/entities/user-group.entity';
import { UserPermission } from './permissions/entities/user-permission.entity';
import { UserGroupsController } from './permissions/permissions.controller';
import { User } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { AuthService } from './users/users.service';

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
  controllers: [UsersController, UserGroupsController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
