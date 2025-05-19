import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { SigninUseCase } from '../../signin.usecase';

describe('SigninUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SigninUseCase.UseCase;
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
    sut = new SigninUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should not be able to authenticate with wrong email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: 'testPassword',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('testPassword');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@email.com', password: hashPassword }),
    );
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    await expect(() =>
      sut.execute({
        email: 'test@email.com',
        password: 'fakePassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should throws error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: '',
        password: 'testPassword',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should throws error when password not provided', async () => {
    await expect(() =>
      sut.execute({
        email: 'test@email.com',
        password: '',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('testPassword');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@email.com', password: hashPassword }),
    );
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    await expect(() =>
      sut.execute({
        email: 'test@email.com',
        password: 'fakePassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('testPassword');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@email.com', password: hashPassword }),
    );
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    const output = await sut.execute({
      email: entity.email,
      password: 'testPassword',
    });

    expect(output).toMatchObject(entity.toJSON());
  });
});
