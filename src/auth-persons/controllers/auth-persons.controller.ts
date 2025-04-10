import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';

import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { UsersService } from '../../auth/providers/users.service';
import { PersonsService } from '../../persons/providers/persons.service';
import { HashingService } from '../../shared/providers/hashing.service';
import { CreateAuthPersonDTO } from '../data-objects/create-auth-person.dto';
import { AuthPersonsService } from '../providers/auth-persons.service';
import { destination } from '../../multer.config';

@Controller('auth-persons')
export class AuthPersonsController {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly personsService: PersonsService,
    protected readonly authPersonsService: AuthPersonsService,
    protected readonly hashingService: HashingService,
    protected readonly em: EntityManager,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() body: CreateAuthPersonDTO,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    const now = new Date();

    if (avatar === undefined) {
      throw new BadRequestException('Avatar field is required');
    }

    if (avatar.buffer.length === 0) {
      throw new BadRequestException('Avatar file is empty');
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

    const password = this.hashingService.password(body.password);

    const userData = {
      email: body.email,
      password: password,
      createdAt: now,
      slug: crypto
        .createHash('md5')
        .update(body.email + now.getTime())
        .digest('hex'),
      jwtVersion: Date.now(),
    };

    await this.em.transactional(async (em: EntityManager) => {
      try {
        const user = await this.usersService.create(em, userData);
        const person = await this.personsService.create(em, personData);
        await this.authPersonsService.create(em, { person, user });
        await fs.writeFile(destination(avatar), avatar.buffer);
        await em.commit();
      } catch (error) {
        console.error(error);
        await em.rollback();
        throw new InternalServerErrorException((error as Error).message);
      }
    });
  }
}
