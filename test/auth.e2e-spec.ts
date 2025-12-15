import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from './../src/auth/auth.module';

describe('Auth E2E', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/auth/login (POST)', () => {
    const signInDto = {
      email: 'jean@example.com',
      password: 'password',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(signInDto)
      .expect(200);
  });

  it('/auth/login (POST) - invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'jeanbon@example.com',
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('/auth/login (POST) - missing fields', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'jean@example.com',
      })
      .expect(400);
  });
});
