import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../users.service';
import { JwtPayload } from '../../jwt/jwt.interface';
import { type ClientRequest, type ServerResponse } from 'node:http';

type RequestWithContext = ClientRequest & {
  user?: JwtPayload;
};

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    if (request.user === undefined) {
      throw new UnauthorizedException();
    }

    const { sub, pms, ugs } = request.user;

    const token = this.authService.refreshJWT({ sub, pms, ugs });

    if (token === undefined) {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<ServerResponse>();

    response.setHeader('Authorization', `Bearer ${token}`);

    return next.handle();
  }
}
