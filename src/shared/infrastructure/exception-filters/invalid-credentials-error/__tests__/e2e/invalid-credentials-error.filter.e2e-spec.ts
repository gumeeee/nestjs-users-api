import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new InvalidCredentialsError('Credentials invalid');
  }
}

describe('InvalidCredentialsErrorFilter e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
      // imports: [EnvConfigModule, UsersModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new InvalidCredentialsErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(new InvalidCredentialsErrorFilter()).toBeDefined();
  });

  it('should catch bad request error', () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Credentials invalid',
    });
  });
});
