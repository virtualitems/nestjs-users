import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

const socketPath = process.argv[2];

if (socketPath === undefined) {
  throw new Error('Socket path is not defined');
}

async function bootstrap(socketPath: string): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
  }

  await app.listen(socketPath);
  console.log(`Application is listening on socket ${socketPath}`);
}

void bootstrap(socketPath);
