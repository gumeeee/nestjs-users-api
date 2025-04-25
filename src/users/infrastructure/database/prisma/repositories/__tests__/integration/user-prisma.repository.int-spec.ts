/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('should throws error when user model not found', () => {
    expect(() => sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID: fakeId'),
    );
  });

  it('should finds a entity by id', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: {
        ...userEntity.toJSON(),
      },
    });

    const result = await sut.findById(newUser.id);

    expect(result.toJSON()).toStrictEqual(userEntity.toJSON());
  });

  it('should insert a new userEntity', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await sut.insert(userEntity);

    const result = await prismaService.user.findUnique({
      where: {
        id: userEntity._id,
      },
    });

    expect(result).toBeDefined();
    expect(result).toStrictEqual(userEntity.toJSON());
  });

  it('should return all users', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: {
        ...userEntity.toJSON(),
      },
    });

    const userEntities = await sut.findAll();
    expect(userEntities).toHaveLength(1);

    userEntities.forEach(item =>
      expect(item.toJSON()).toStrictEqual(userEntity.toJSON()),
    );
  });
});
