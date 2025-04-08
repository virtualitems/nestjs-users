import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '../interfaces/jwt.interface';
import { Request, Response } from 'express';
import { env } from '../env';
import { miliseconds } from '../numerics';

type RequestWithUser = Request & {
  user?: JwtPayload;
};

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(protected readonly jwtService: JwtService) {}

  getRequest(context: ExecutionContext): RequestWithUser {
    return context.switchToHttp().getRequest<RequestWithUser>();
  }

  getResponse(context: ExecutionContext): Response {
    return context.switchToHttp().getResponse<Response>();
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = this.getRequest(context);
    const response = this.getResponse(context);

    if (request.user === undefined) {
      return next.handle();
    }

    const { iat: _iat, exp: _exp, ...data } = request.user;

    if (data.rex === undefined || data.rex < Date.now()) {
      return next.handle();
    }

    const token = this.jwtService.sign(data);

    response.cookie(env.JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: miliseconds(env.JWT_COOKIE_MAX_AGE),
    });

    return next.handle();
  }
}
