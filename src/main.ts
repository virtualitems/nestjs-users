import * as fs from 'fs';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const socketPath = process.env.LISTEN_TO;

if (socketPath === undefined) {
  throw new Error('Socket path is not defined');
}

async function bootstrap(socketPath: string): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
  }

  await app.listen(socketPath);
}

void bootstrap(socketPath);
