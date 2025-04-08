import * as crypto from 'node:crypto';

import { EntityManager } from '@mikro-orm/postgresql';
import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { permissions } from '../../auth/constants/permissions';
import { PermissionsService } from '../../auth/providers/permissions.service';
import { UsersService } from '../../auth/providers/users.service';
import { HashingService } from '../../shared/providers/hashing.service';
import { SetupDTO } from '../data-objects/setup.dto';

@Controller('setup')
export class SetupController {
  public constructor(
    protected readonly em: EntityManager,
    protected readonly usersService: UsersService,
    protected readonly hashingService: HashingService,
    protected readonly permissionsService: PermissionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async setup(@Body() body: SetupDTO): Promise<void> {
    const existent = await this.usersService.list(this.em, {
      limit: 1,
    });

    if (existent.length > 0) {
      throw new ForbiddenException('Setup already done');
    }

    const time = new Date().getTime();

    const data = {
      email: body.userEmail,
      slug: crypto
        .createHash('md5')
        .update(body.userEmail + time)
        .digest('hex'),
      password: this.hashingService.password(body.userPassword),
      jwtVersion: time,
      createdAt: new Date(),
    };

    await this.em.transactional(async (em: EntityManager) => {
      try {
        const user = await this.usersService.create(em, data);
        const perms = await this.permissionsService.list(em, {
          where: {
            slug: {
              $in: [
                permissions.USERS_LOGIN,
                permissions.USERS_CREATE,
                permissions.USERS_GET_PERMISSIONS,
                permissions.USERS_SET_PERMISSIONS,
              ],
            },
          },
        });
        user.permissions.set(perms);
        await em.persist(user).flush();
        await em.commit();
      } catch (error) {
        console.error(error);
        await em.rollback();
      }
    });
  }
}
