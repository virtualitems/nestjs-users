import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ClientRequest } from 'http';
import { UsersService } from '../providers/users.service';
import { JwtPayload } from '../interfaces/jwt.interface';
import { EntityManager } from '@mikro-orm/sqlite';

export const PERMISSIONS_META_KEY = 'meta_user_permissions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export function Permissions(...permissions: string[]) {
  return SetMetadata(PERMISSIONS_META_KEY, permissions);
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    protected reflector: Reflector,
    protected em: EntityManager,
    protected usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const reqPermissions = this.reflector.get<string[]>(
      PERMISSIONS_META_KEY,
      context.getHandler(),
    );

    if (reqPermissions === undefined || reqPermissions.length === 0) {
      return true;
    }

    const request: ClientRequest & { user: JwtPayload } = context
      .switchToHttp()
      .getRequest();

    const payload = request.user;

    const user = await this.usersService.find(this.em, { id: payload.sub });

    if (user === null) {
      return false;
    }

    const permsSet = new Set();

    const userPerms = await user.permissions.init({
      fields: ['slug'],
    });

    userPerms.getItems().forEach((perm) => {
      permsSet.add(perm.slug);
    });

    const userGroups = await user.groups.init({
      fields: ['permissions'],
      populate: ['permissions'],
    });

    userGroups.getItems().forEach((group) => {
      group.permissions.getItems().forEach((perm) => {
        permsSet.add(perm.slug);
      });
    });

    this.em.clear();

    for (const perm of reqPermissions) {
      if (!permsSet.has(perm)) {
        return false;
      }
    }

    return true;
  }
}
