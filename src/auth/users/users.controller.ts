import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { namespaces, routes } from '../../routes';
import { AuthService } from '.././auth.service';
import { AuthUserDTO } from './data-objects/auth-user.dto';
import { CreateUserDTO } from './data-objects/create-user.dto';
import { ListUsersDTO } from './data-objects/list-users.dto';
import { UpdateUserDTO } from './data-objects/update-user.dto';
import { User } from './entities/user.entity';
import { EntityManager } from '@mikro-orm/sqlite';

const urls = routes();

@Controller(namespaces.users)
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly em: EntityManager,
  ) {}

  @Get(urls.users.listAsJSON.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  public async list(
    @Query() query: ListUsersDTO,
  ): Promise<HttpJsonResponse<Partial<User>[]>> {
    const users = await this.authService.listAll(query);
    return { data: users };
  }

  @Get(urls.users.showAsJSON.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  public async show(
    @Param('id') id: number,
  ): Promise<HttpJsonResponse<Partial<User>>> {
    const user = await this.authService.show({ id });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    return { data: user };
  }

  @Post(urls.users.createWithJSON.path)
  @HttpCode(201)
  public async create(@Body() data: CreateUserDTO): Promise<void> {
    const existent = await this.authService.find({
      email: data.email,
      deletedAt: null,
    });

    if (existent !== null) {
      throw new BadRequestException('User already exists');
    }

    const user: User = {
      email: data.email,
      password: data.password,
    };

    await this.authService.create(this.em, user);
  }

  @Put(urls.users.updateWithJSON.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  public async update(
    @Param('id') id: number,
    @Body() data: UpdateUserDTO,
  ): Promise<void> {
    const user = await this.authService.find({ id, deletedAt: null });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    if (data.email) {
      user.email = data.email;
    }

    if (data.password) {
      user.password = this.authService.hashPassword(data.password);
    }

    await this.authService.update(this.em, user);
  }

  @Delete(urls.users.delete.path)
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  public async delete(@Param('id') id: number): Promise<void> {
    const user = await this.authService.find({ id, deletedAt: null });

    if (user === null) {
      throw new NotFoundException('User not found');
    }

    await this.authService.delete(this.em, user);
  }

  @Post(urls.users.loginWithJSON.path)
  @HttpCode(200)
  public async login(@Body() data: AuthUserDTO): Promise<object> {
    let user: User;

    try {
      user = await this.authService.authenticate(data.email, data.password);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLogin = new Date();

    await this.authService.update(this.em, user);

    const access_token = await this.authService.generateJWT(user);
    const authorization = `Bearer ${access_token}`;

    return { authorization };
  }
}
