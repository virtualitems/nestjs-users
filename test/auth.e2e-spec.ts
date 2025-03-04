import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDTO } from '../src/auth/data-objects/create-user.dto';
import { AuthModule } from '../src/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../src/mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { routes } from '../src/routes';
import { AuthUserDTO } from 'src/auth/data-objects/auth-user.dto';
import { UpdateUserDTO } from '../src/auth/data-objects/update-user.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const urls = routes();

  const rnd = Math.random().toString(36).substring(10);
  const userData = {
    email: rnd + '@example.com',
    password: rnd,
  };

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
    const createUserDto: CreateUserDTO = userData;

    request(app.getHttpServer())
      .post(urls.users.createWithJSON.url)
      .send(createUserDto)
      .then((response) => {
        expect(response.status).toBe(201);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('/users/login (POST) - login', (done) => {
    const authUserDto: AuthUserDTO = userData;

    request(app.getHttpServer())
      .post(urls.users.loginWithJSON.url)
      .send(authUserDto)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('authorization');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('/users (GET) - findAll', (done) => {
    const authUserDto: AuthUserDTO = userData;

    request(app.getHttpServer())
      .post(urls.users.loginWithJSON.url)
      .send(authUserDto)
      .then((response) => response.body as { authorization: string })
      .then((body) =>
        request(app.getHttpServer())
          .get(urls.users.listAsJSON.url)
          .set('Authorization', body.authorization),
      )
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty('data');

        const body = response.body as { data: any[] };
        expect(body.data).toBeInstanceOf(Array);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  it('/users/:id (GET) - findOne', (done) => {
    const authUserDto: AuthUserDTO = userData;

    Promise.resolve()
      .then(() =>
        request(app.getHttpServer())
          .post(urls.users.loginWithJSON.url)
          .send(authUserDto)
          .then((response) => response.body as { authorization: string })
          .then((body) => body.authorization),
      )
      .then((authorization) =>
        request(app.getHttpServer())
          .get(urls.users.listAsJSON.url)
          .set('Authorization', authorization)
          .then((response) => {
            const body = response.body as { data: Array<{ id: number }> };
            const users = body.data;
            expect(users).toBeInstanceOf(Array);
            expect(users.length).toBeGreaterThan(0);
            const user = users[users.length - 1];
            return { authorization, userID: user.id };
          }),
      )
      .then(({ authorization, userID }) =>
        request(app.getHttpServer())
          .get(urls.users.showAsJSON.url.replace(':id', userID.toString()))
          .set('Authorization', authorization)
          .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');

            const body = response.body as { data: { id: number } };
            const data = body.data;

            expect(data).toBeInstanceOf(Object);
            expect(data).toHaveProperty('id');
            expect(data.id).toBe(userID);
            done();
          }),
      )
      .catch((err) => {
        done(err);
      });
  });

  it('/users/:id (PUT) - update', (done) => {
    const authUserDto: AuthUserDTO = userData;

    Promise.resolve()
      .then(() =>
        request(app.getHttpServer())
          .post(urls.users.loginWithJSON.url)
          .send(authUserDto)
          .then((response) => response.body as { authorization: string })
          .then((body) => body.authorization),
      )
      .then((authorization) =>
        request(app.getHttpServer())
          .get(urls.users.listAsJSON.url)
          .set('Authorization', authorization)
          .then((response) => {
            const body = response.body as { data: Array<{ id: number }> };
            const users = body.data;
            expect(users).toBeInstanceOf(Array);
            expect(users.length).toBeGreaterThan(0);
            const user = users[users.length - 1];
            return { authorization, userID: user.id };
          }),
      )
      .then(({ authorization, userID }) => {
        const updateUserDto: UpdateUserDTO = {
          email: 'updated' + rnd + '@example.com',
          password: 'updated' + rnd,
        };
        return request(app.getHttpServer())
          .put(urls.users.updateWithJSON.url.replace(':id', userID.toString()))
          .set('Authorization', authorization)
          .send(updateUserDto)
          .then((response) => {
            expect(response.status).toBe(204);
            done();
          });
      })
      .catch((err) => {
        done(err);
      });
  });

  it('/users/:id (DELETE) - delete', (done) => {
    const authUserDto: AuthUserDTO = userData;

    Promise.resolve()
      .then(() =>
        request(app.getHttpServer())
          .post(urls.users.loginWithJSON.url)
          .send(authUserDto)
          .then((response) => response.body as { authorization: string })
          .then((body) => body.authorization),
      )
      .then((authorization) =>
        request(app.getHttpServer())
          .get(urls.users.listAsJSON.url)
          .set('Authorization', authorization)
          .then((response) => {
            const body = response.body as { data: Array<{ id: number }> };
            const users = body.data;
            expect(users).toBeInstanceOf(Array);
            expect(users.length).toBeGreaterThan(0);
            const user = users[users.length - 1];
            return { authorization, userID: user.id };
          }),
      )
      .then(({ authorization, userID }) =>
        request(app.getHttpServer())
          .delete(urls.users.delete.url.replace(':id', userID.toString()))
          .set('Authorization', authorization)
          .then((response) => {
            expect(response.status).toBe(204);
            done();
          }),
      )
      .catch((err) => {
        done(err);
      });
  });

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
