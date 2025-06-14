/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { applyGlobalConfig } from '@/global-config';
import { HashProvider } from '@/shared/application/providers/hash-provider';
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
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';
import { UsersModule } from '../../users.module';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updatePasswordDto: UpdatePasswordDto;
  const prismaService = new PrismaClient();
  let hashProvider: HashProvider;
  let entity: UserEntity;

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
  });

  beforeEach(async () => {
    updatePasswordDto = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    };

    await prismaService.user.deleteMany({});
    const hashPassword = await hashProvider.generateHash('oldPassword');
    entity = new UserEntity(UserDataBuilder({ password: hashPassword }));

    await repository.insert(entity);
  });

  describe('PATCH /users', () => {
    it('should update a password', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDto)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const user = await repository.findById(res.body.data.id);
      const checkNewPassword = await hashProvider.compareHash(
        'newPassword',
        user.password,
      );

      expect(checkNewPassword).toBeTruthy();
    });

    it('should return a erro with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/fakeId`)
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'newPassword should not be empty',
        'newPassword must be a string',
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]);
    });

    it('should return a erro with 404 code when throw NotFoundError with invalida id', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/fakeId`)
        .send(updatePasswordDto)
        .expect(404);

      expect(res.body.error).toBe('Not Found');
      expect(res.body.message).toEqual('UserModel not found using ID: fakeId');
    });

    it('should return a erro with 422 code when the newPassword field is invalid', async () => {
      const { newPassword, ...oldPassword } = updatePasswordDto;

      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(oldPassword)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'newPassword should not be empty',
        'newPassword must be a string',
      ]);
    });

    it('should return a erro with 422 code when the oldPassword field is invalid', async () => {
      const { oldPassword, ...newPassword } = updatePasswordDto;

      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(newPassword)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]);
    });

    it('should return a erro with 422 code when the oldPassword does not match', async () => {
      updatePasswordDto.oldPassword = 'wrongPassword';

      const res = await request(app.getHttpServer())
        .patch(`/users/${entity.id}`)
        .send(updatePasswordDto)
        .expect(422)
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Old password does not match',
        });
    });
  });
});
