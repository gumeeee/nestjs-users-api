import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { ListUsersUseCase } from '../../listusers.usecase';

describe('ListUsersUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListUsersUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListUsersUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should return the users ordered by created_at', async () => {
    const created_at = new Date();
    const entities: UserEntity[] = [];
    const arrange = Array(4).fill(UserDataBuilder({}));
    arrange.forEach((item, index) => {
      entities.push(
        new UserEntity({
          ...item,
          email: `test${index}@email.com`,
          created_at: new Date(created_at.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map(item => item.toJSON()),
    });

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: [...entities].reverse().map(item => item.toJSON()),
      total: 4,
      currentPage: 1,
      pageSize: 15,
      lastPage: 1,
    });
  });

  it('should returns output using filter, sort and paginate', async () => {
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

    let output = await sut.execute({
      page: 1,
      pageSize: 2,
      sort: 'name',
      sortDirection: 'asc',
      filter: 'TEST',
    });
    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      pageSize: 2,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      pageSize: 2,
      sort: 'name',
      sortDirection: 'asc',
      filter: 'TEST',
    });
    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      pageSize: 2,
      lastPage: 2,
    });
  });
});
