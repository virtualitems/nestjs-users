import { JwtStrategy } from 'src/shared/providers/jwt.strategy';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PermissionsController } from './controllers/permissions.controller';
import { RolesController } from './controllers/roles.controller';
import { UsersController } from './controllers/users.controller';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { UserPermission } from './entities/user-permission.entity';
import { UserRole } from './entities/user-role.entity';
import { User } from './entities/user.entity';
import { HashingService } from './providers/hashing.service';
import { PermissionsService } from './providers/permissions.service';
import { RolesService } from './providers/roles.service';
import { UsersService } from './providers/users.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES_IN') },
      }),
    }),
    MikroOrmModule.forFeature({
      entities: [
        User,
        Role,
        Permission,
        UserRole,
        UserPermission,
        RolePermission,
      ],
    }),
  ],
  controllers: [UsersController, RolesController, PermissionsController],
  providers: [
    HashingService,
    JwtStrategy,
    PermissionsService,
    RolesService,
    UsersService,
  ],
  exports: [UsersService, RolesService, PermissionsService],
})
export class AuthModule {}
