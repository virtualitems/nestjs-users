import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { env } from './shared/dotenv';
import { JwtAuthGuard } from './shared/providers/jwt.guard';
import { RefreshTokenInterceptor } from './shared/providers/jwt.interceptor';

@Controller()
export class AppController {
  protected readonly baseUrl: string;

  public constructor() {
    this.baseUrl = env.BASE_URL;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  public index(): object {
    return {
      setup: {
        store: this.baseUrl + '/setup',
      },
      authPersons: {
        store: this.baseUrl + '/auth-persons',
      },
      permissions: {
        list: this.baseUrl + '/permissions',
        roles: this.baseUrl + '/permissions/:id/roles',
        users: this.baseUrl + '/permissions/:id/users',
      },
      roles: {
        list: this.baseUrl + '/roles',
        show: this.baseUrl + '/roles/:id',
        store: this.baseUrl + '/roles',
        update: this.baseUrl + '/roles/:id',
        delete: this.baseUrl + '/roles/:id',
        permissions: this.baseUrl + '/roles/:id/permissions',
        users: this.baseUrl + '/roles/:id/users',
      },
      users: {
        list: this.baseUrl + '/users',
        show: this.baseUrl + '/users/:id',
        store: this.baseUrl + '/users',
        update: this.baseUrl + '/users/:id',
        delete: this.baseUrl + '/users/:id',
        permissions: this.baseUrl + '/users/:id/permissions',
        roles: this.baseUrl + '/users/:id/roles',
      },
    };
  }

  @Get('health')
  @HttpCode(HttpStatus.NO_CONTENT)
  public health(): void {}
}
