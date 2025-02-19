import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { routes } from './routes';

@Controller()
export class AppController
{
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  index(): RoutesDirectory
  {
    return routes;
  }
}
