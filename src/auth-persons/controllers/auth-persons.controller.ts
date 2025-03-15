import * as crypto from 'node:crypto';
import * as fs from 'node:fs';

import { EntityManager } from '@mikro-orm/sqlite';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UploadedFile,
  // UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateAuthPersonDTO } from '../data-objects/create-auth-person.dto';
// import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
// import { RefreshTokenInterceptor } from '../../auth/interceptors/jwt.interceptor';
// import { permissions } from '../../auth/constants/permissions';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfiguration } from '../../multer.config';
import { PersonsService } from '../../persons/providers/persons.service';
import { UsersService } from '../../auth/providers/users.service';
import { AuthPersonsService } from '../providers/auth-persons.service';

@Controller('auth-persons')
export class AuthPersonsController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly personsService: PersonsService,
    protected readonly authPersonsService: AuthPersonsService,
    protected readonly em: EntityManager,
  ) {}

  @Post()
  // @Permissions(permissions.USERS_CREATE, permissions.PERSONS_CREATE)
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(RefreshTokenInterceptor)
  @UseInterceptors(FileInterceptor('avatar', multerConfiguration))
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() body: CreateAuthPersonDTO,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    const now = new Date();

    if (avatar === undefined) {
      throw new BadRequestException('Avatar field is required');
    }

    const existent = await this.usersService.find(
      this.em,
      {
        email: body.email,
        deletedAt: null,
      },
      {
        fields: ['id'],
      },
    );

    if (existent !== null) {
      throw new BadRequestException('User already exists');
    }

    const personData = {
      name: body.name,
      avatar: avatar.path,
      createdAt: now,
    };

    const userData = {
      email: body.email,
      password: body.password,
      createdAt: now,
      slug: crypto
        .createHash('md5')
        .update(body.email + now.getTime())
        .digest('hex'),
    };

    await this.em.transactional(async (em: EntityManager) => {
      try {
        const user = await this.usersService.create(em, userData);
        const person = await this.personsService.create(em, personData);
        await this.authPersonsService.create(em, { person, user });
        await em.commit();
      } catch (error) {
        console.error(error);
        await em.rollback();
        fs.unlinkSync(avatar.path);
        throw new InternalServerErrorException((error as Error).message);
      }
    });
  }
}
