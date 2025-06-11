/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictErrorFilter } from '../../conflict-error.filter';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new ConflictError('Conflicting data');
  }
}

describe('ConflictErrorFilter (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
      // imports: [EnvConfigModule, UsersModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new ConflictErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(new ConflictErrorFilter()).toBeDefined();
  });

  it('should catch conflict error', () => {
    return request(app.getHttpServer()).get('/stub').expect(409).expect({
      statusCode: 409,
      error: 'Conflict',
      message: 'Conflicting data',
    });
  });
});
