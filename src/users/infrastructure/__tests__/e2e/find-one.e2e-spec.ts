/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { applyGlobalConfig } from '@/global-config';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';
import { UsersController } from '../../users.controller';
import { UsersModule } from '../../users.module';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();
  let entity: UserEntity;
  let hashProvider: HashProvider;
  let hashPassword: string;
  let accessToken: string;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository.Repository>('UserRepository');
    hashProvider = new BcryptjsHashProvider();
    hashPassword = await hashProvider.generateHash('123456');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany({});
    entity = new UserEntity(
      UserDataBuilder({
        email: 'test@email.com',
        password: hashPassword,
      }),
    );
    await repository.insert(entity);

    const loginResponse: { body: { accessToken: string } } = await request(
      app.getHttpServer(),
    )
      .post('/users/login')
      .send({
        email: 'test@email.com',
        password: '123456',
      })
      .expect(200);

    accessToken = loginResponse.body.accessToken;
  });

  describe('GET /users/:id', () => {
    it('should get a user', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${entity.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const presenter = UsersController.userToResponse(entity.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toStrictEqual(serialized);
    });

    it('should return a erro with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/fakeid')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using ID: fakeid',
        });
    });

    it('should return a erro with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/fakeid')
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'No token provided',
        });
    });
  });
});
