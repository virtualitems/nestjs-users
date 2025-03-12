import { type ClientRequest, type ServerResponse } from 'node:http';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtPayload } from '../interfaces/jwt.interface';
import { SecurityService } from '../providers/security.service';

type RequestWithContext = ClientRequest & {
  user?: JwtPayload;
};

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(protected readonly securityService: SecurityService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const response = context.switchToHttp().getResponse<ServerResponse>();

    if (request.user === undefined) {
      throw new UnauthorizedException();
    }

    const { sub, pms, ugs } = request.user;

    const token = this.securityService.generate({ sub, pms, ugs });

    if (token === undefined) {
      return next.handle();
    }

    response.setHeader('Authorization', `Bearer ${token}`);

    return next.handle();
  }
}
