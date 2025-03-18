import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { RolesController } from './controllers/roles.controller';
import { UsersController } from './controllers/users.controller';

import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { UserPermission } from './entities/user-permission.entity';
import { User } from './entities/user.entity';

import { RolesService } from './providers/roles.service';
import { JwtStrategy } from './providers/jwt.strategy';
import { SecurityService } from './providers/security.service';
import { UsersService } from './providers/users.service';
import { PermissionsService } from './providers/permissions.service';
import { PermissionsGuard } from './guards/jwt.guard';
import { PermissionsController } from './controllers/permissions.controller';

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
    ConfigService,
    RolesService,
    JwtService,
    JwtStrategy,
    PermissionsGuard,
    PermissionsService,
    SecurityService,
    UsersService,
  ],
  exports: [UsersService, RolesService, PermissionsService],
})
export class AuthModule {}
