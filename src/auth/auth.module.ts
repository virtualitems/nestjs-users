import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './jwt/jwt.strategy';
import { GroupPermission } from './entities/group-permission.entity';
import { Group } from './entities/group.entity';
import { Permission } from './entities/permission.entity';
import { UserGroup } from './entities/user-group.entity';
import { UserPermission } from './entities/user-permission.entity';
import { GroupsController } from './controllers/groups.controller';
import { User } from './entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { GroupsService } from './services/groups.service';

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
  providers: [JwtStrategy, UsersService, GroupsService],
})
export class AuthModule {}
