import { ClientRequest, ServerResponse } from 'node:http';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../interfaces/jwt.interface';

type RequestWithContext = ClientRequest & {
  user?: JwtPayload;
};

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(protected readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const response = context.switchToHttp().getResponse<ServerResponse>();

    if (request.user === undefined) {
      return next.handle();
    }

    const payload = { ...request.user };

    delete payload.iat;
    delete payload.exp;

    const token = this.jwtService.sign(payload);

    response.setHeader('Authorization', `Bearer ${token}`);

    return next.handle();
  }
}
