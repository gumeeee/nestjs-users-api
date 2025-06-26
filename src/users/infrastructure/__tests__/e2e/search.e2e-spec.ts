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
import request from 'supertest';
import { UsersModule } from '../../users.module';
import { instanceToPlain } from 'class-transformer';
import { UsersController } from '../../users.controller';
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

  describe('GET /users', () => {
    it('should return the users ordered by created_at', async () => {
      const created_at = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(3).fill(UserDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            email: `test${index}@email.com`,
            created_at: new Date(created_at.getTime() + index),
          }),
        );
      });

      await prismaService.user.deleteMany();
      await prismaService.user.createMany({
        data: entities.map(entity => entity.toJSON()),
      });
      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map(entity =>
            instanceToPlain(UsersController.userToResponse(entity.toJSON())),
          ),
        meta: { currentPage: 1, pageSize: 15, lastPage: 1, total: 3 },
      });
    });

    it('should return the users ordered by created_at', async () => {
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({}),
            name: element,
            email: `test${index}@email.com`,
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map(entity => entity.toJSON()),
      });
      let searchParams = {
        page: 1,
        pageSize: 2,
        sort: 'name',
        sortDirection: 'asc',
        filter: 'test',
      };
      let queryParams = new URLSearchParams(searchParams as any).toString();

      let res = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[0].toJSON(), entities[4].toJSON()].map(entity =>
          instanceToPlain(UsersController.userToResponse(entity)),
        ),
        meta: { currentPage: 1, pageSize: 2, lastPage: 2, total: 3 },
      });

      searchParams = {
        page: 2,
        pageSize: 2,
        sort: 'name',
        sortDirection: 'asc',
        filter: 'test',
      };
      queryParams = new URLSearchParams(searchParams as any).toString();

      res = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[2].toJSON()].map(entity =>
          instanceToPlain(UsersController.userToResponse(entity)),
        ),
        meta: { currentPage: 2, pageSize: 2, lastPage: 2, total: 3 },
      });
    });

    it('should return a erro with 422 code when the query param is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/?fakeid=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toStrictEqual([
        'property fakeid should not exist',
      ]);
    });

    it('should return a erro with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'No token provided',
        });
    });
  });
});
