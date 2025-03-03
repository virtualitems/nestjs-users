import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { routes } from './routes';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  index(): RoutesDirectory {
    return routes(this.configService.getOrThrow('BASE_URL'));
  }
}
