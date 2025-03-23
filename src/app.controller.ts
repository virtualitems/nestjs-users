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

  constructor() {
    this.baseUrl = env.BASE_URL;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  index(): object {
    return {
      authPersons: {
        rest: this.baseUrl + '/auth-persons/',
      },
      permissions: {
        rest: this.baseUrl + '/permissions/',
      },
      roles: {
        rest: this.baseUrl + '/roles/',
        permissions: this.baseUrl + '/roles/permissions/',
      },
      users: {
        rest: this.baseUrl + '/users/',
        permissiosn: this.baseUrl + '/users/permissions/',
        roles: this.baseUrl + '/users/roles/',
      },
    };
  }
}
