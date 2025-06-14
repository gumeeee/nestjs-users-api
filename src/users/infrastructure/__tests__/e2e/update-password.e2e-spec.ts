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
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { UsersController } from '../../users.controller';
import { UsersModule } from '../../users.module';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';

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

    // it('should return a erro with 422 code when the name field is invalid', async () => {
    //   const { name, ...signUpWithoutName } = updatePasswordDto;
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpWithoutName)
    //     .expect(422);

    //   expect(res.body.error).toBe('Unprocessable Entity');
    //   expect(res.body.message).toEqual([
    //     'name should not be empty',
    //     'name must be a string',
    //   ]);
    // });

    // it('should return a erro with 422 code when the email field is invalid', async () => {
    //   const { email, ...signUpWithoutEmail } = updatePasswordDto;
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpWithoutEmail)
    //     .expect(422);

    //   expect(res.body.error).toBe('Unprocessable Entity');
    //   expect(res.body.message).toEqual([
    //     'email must be an email',
    //     'email should not be empty',
    //     'email must be a string',
    //   ]);
    // });

    // it('should return a erro with 422 code when the password field is invalid', async () => {
    //   const { password, ...signUpWithoutPassword } = updatePasswordDto;
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpWithoutPassword)
    //     .expect(422);

    //   expect(res.body.error).toBe('Unprocessable Entity');
    //   expect(res.body.message).toEqual([
    //     'password should not be empty',
    //     'password must be a string',
    //   ]);
    // });

    // it('should return a erro with 422 code with invalid field provided', async () => {
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(Object.assign(updatePasswordDto, { xpto: 'fakeValue' }))
    //     .expect(422);

    //   expect(res.body.error).toBe('Unprocessable Entity');
    //   expect(res.body.message).toEqual(['property xpto should not exist']);
    // });

    // it('should return a erro with 409 code when the email is duplicated', async () => {
    //   const entity = new UserEntity(UserDataBuilder({ ...updatePasswordDto }));
    //   await repository.insert(entity);

    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(updatePasswordDto)
    //     .expect(409)
    //     .expect({
    //       statusCode: 409,
    //       error: 'Conflict',
    //       message: 'Email addres already used',
    //     });

    //   console.log(res.body);
    // });
  });
});
