import { ClientRequest } from 'http';

import { EntityManager } from '@mikro-orm/sqlite';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { PermissionsService } from '../../auth/providers/permissions.service';
import { UsersService } from '../../auth/providers/users.service';
import { JwtPayload } from '../interfaces/jwt.interface';

export const PERMISSIONS_META_KEY = 'meta_user_permissions';

export function Permissions(...permissions: string[]) {
  return SetMetadata(PERMISSIONS_META_KEY, permissions);
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    protected readonly em: EntityManager,
    protected readonly reflector: Reflector,
    protected readonly usersService: UsersService,
    protected readonly permissionsService: PermissionsService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if ((await super.canActivate(context)) === false) {
      return false;
    }

    const reqPermissions = this.reflector.get<string[]>(
      PERMISSIONS_META_KEY,
      context.getHandler(),
    );

    if (reqPermissions === undefined || reqPermissions.length === 0) {
      return true;
    }

    const request: ClientRequest & { user?: JwtPayload } = context
      .switchToHttp()
      .getRequest();

    if (request.user === undefined) {
      return false;
    }

    const payload = request.user;

    const user = await this.usersService.find(this.em, {
      id: payload.sub,
      deletedAt: null,
    });

    if (user === null) {
      return false;
    }

    const perms = await this.usersService.permissions(this.em, user);

    for (const perm of reqPermissions) {
      if (!perms.some((p) => p.slug === perm)) {
        return false;
      }
    }

    return true;
  }
}
