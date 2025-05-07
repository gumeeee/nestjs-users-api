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
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

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

  it('should throws error when user model not found', async () => {
    await expect(() => sut.findById('fakeId')).rejects.toThrow(
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

  it('should throws error on update when a user model not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID: ${entity._id}`),
    );
  });

  it('should update a user entity', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: {
        ...userEntity.toJSON(),
      },
    });

    userEntity.update('new name');
    await sut.update(userEntity);

    const output = await prismaService.user.findUnique({
      where: {
        id: userEntity._id,
      },
    });
    expect(output?.name).toBe('new name');
  });

  it('should throws error on delete when a user model not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID: ${entity._id}`),
    );
  });

  it('should delete a user entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    await sut.delete(entity.id);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(output).toBeNull();
  });

  it('should throws error on find by email when a user model not found', async () => {
    await expect(() => sut.findByEmail('test@email.com')).rejects.toThrow(
      new NotFoundError(`UserModel not found using email: test@email.com`),
    );
  });

  it('should find a user entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@email.com' }));
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    const output = await sut.findByEmail('test@email.com');

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throws error on email exists when a user model found', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@email.com' }));
    await prismaService.user.create({
      data: {
        ...entity.toJSON(),
      },
    });

    await expect(() => sut.emailExists('test@email.com')).rejects.toThrow(
      new ConflictError(`Email addres already used`),
    );
  });

  it('should not finds a user entity by email', async () => {
    expect.assertions(0);

    await sut.emailExists('test@email.com');
  });
  describe('search method tests', () => {
    it('should apply only pagination when the others params are null', async () => {
      const created_at = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(16).fill(UserDataBuilder({}));
      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...item,
            name: `User${index}`,
            email: `test${index}@email.com`,
            created_at: new Date(created_at.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach(item =>
        expect(item).toBeInstanceOf(UserEntity),
      );
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@email.com`).toBe(item.email);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date();
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: item }),
            created_at: new Date(created_at.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      });

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          pageSize: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );

      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          pageSize: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: 'TEST',
        }),
      );
      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
    });
  });
});
