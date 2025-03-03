import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Permission } from './entities/permission.entity';
import { GroupPermission } from './entities/group-permission.entity';
import { UserPermission } from './entities/user-permission.entity';
import { UserGroup } from './entities/user-group.entity';
import { Group } from './entities/group.entity';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
