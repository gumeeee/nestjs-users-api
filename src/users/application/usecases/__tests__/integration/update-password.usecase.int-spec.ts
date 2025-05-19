import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UpdatePasswordUseCase } from '../../update-password.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserPrismaRepository;
  let hashProvider: HashProvider;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should throws error on email not exists a user model found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'testOldPassword',
        newPassword: 'newTestPassword',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID: ${entity.id}`),
    );
  });

  it('should throws error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: '',
        newPassword: 'newTestPassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old and new passwords are required'),
    );
  });

  it('should throws error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'testOldPassword',
        newPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old and new passwords are required'),
    );
  });

  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('testOldPassword');
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    const output = await sut.execute({
      id: entity.id,
      oldPassword: 'testOldPassword',
      newPassword: 'testNewPassword',
    });

    const result = await hashProvider.compareHash(
      'testNewPassword',
      output.password,
    );

    expect(result).toBeTruthy();
  });
});
