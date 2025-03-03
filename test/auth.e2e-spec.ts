import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDTO } from '../src/auth/data-objects/create-user.dto';
// import { AuthUserDTO } from '../src/auth/data-objects/auth-user.dto';
import { AuthModule } from '../src/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../src/mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { routes } from '../src/routes';
// import { UpdateUserDTO } from '../src/auth/data-objects/update-user.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const urls = routes();

  beforeAll((done) => {
    Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(mikroOrmConfig),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        AuthModule,
      ],
    })
      .compile()
      .then((moduleFixture) => moduleFixture.createNestApplication())
      .then((app) => app.init())
      .then((initializedApp) => {
        app = initializedApp;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('/users (POST) - create', (done) => {
    const createUserDto: CreateUserDTO = {
      email: 'test@example.com',
      password: 'password1234',
    };

    request(app.getHttpServer())
      .post(urls.users.createWithJSON.url)
      .send(createUserDto)
      .expect(201)
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  // it('/users (GET) - findAll', async () => {
  //   return request(app.getHttpServer())
  //     .get('/users')
  //     .set('Authorization', 'Bearer valid_token')
  //     .expect(200);
  // });

  // it('/users/:id (GET) - findOne', async () => {
  //   return request(app.getHttpServer())
  //     .get('/users/1')
  //     .set('Authorization', 'Bearer valid_token')
  //     .expect(200);
  // });

  // it('/users/:id (PUT) - update', async () => {
  //   const updateUserDto: UpdateUserDTO = {
  //     email: 'updated@example.com',
  //     name: 'Updated User',
  //   };
  //   return request(app.getHttpServer())
  //     .put('/users/1')
  //     .set('Authorization', 'Bearer valid_token')
  //     .send(updateUserDto)
  //     .expect(204);
  // });

  // it('/users/:id (DELETE) - delete', async () => {
  //   return request(app.getHttpServer())
  //     .delete('/users/1')
  //     .set('Authorization', 'Bearer valid_token')
  //     .expect(204);
  // });

  // it('/users/login (POST) - login', async () => {
  //   const authUserDto: AuthUserDTO = {
  //     email: 'testuser@example.com',
  //     password: 'password1234',
  //   };

  //   return request(app.getHttpServer())
  //     .post('/users/login')
  //     .send(authUserDto)
  //     .expect(200);
  // });

  afterAll((done) => {
    app
      .close()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
