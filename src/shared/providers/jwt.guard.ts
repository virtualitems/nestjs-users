import { EntityManager } from '@mikro-orm/postgresql';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { PermissionsService } from '../../auth/providers/permissions.service';
import { UsersService } from '../../auth/providers/users.service';
import { JwtPayload } from '../interfaces/jwt.interface';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { env } from '../env';

type RequestWithUser = Request & { user?: JwtPayload };

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
    protected readonly jwtService: JwtService,
  ) {
    super();
  }

  getRequest(context: ExecutionContext): RequestWithUser {
    return context.switchToHttp().getRequest();
  }

  getResponse(context: ExecutionContext): Response {
    return context.switchToHttp().getResponse();
  }

  getRequiredPermissions(context: ExecutionContext): string[] {
    return this.reflector.get<string[]>(
      PERMISSIONS_META_KEY,
      context.getHandler(),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const response = this.getResponse(context);
    const reqPerms = this.getRequiredPermissions(context);

    if (!(await super.canActivate(context))) {
      response.clearCookie(env.JWT_COOKIE_NAME);
      return false;
    }

    const payload = request.user as JwtPayload;

    // check user exists
    const user = await this.usersService.find(
      this.em,
      {
        id: payload.sub,
        deletedAt: null,
      },
      {
        fields: ['jwtVersion'],
      },
    );

    if (user === null) {
      response.clearCookie(env.JWT_COOKIE_NAME);
      return false;
    }

    // check user jwt version
    if (user.jwtVersion !== payload.ver) {
      response.clearCookie(env.JWT_COOKIE_NAME);
      return false;
    }

    // check permissions
    if (!reqPerms.every((perm) => payload.per!.includes(perm))) {
      return false;
    }

    return true;
  }
}
