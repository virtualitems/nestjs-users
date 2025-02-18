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


@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [
        User,
        Group,
        Permission,
        UserGroup,
        UserPermission,
        GroupPermission
      ]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
