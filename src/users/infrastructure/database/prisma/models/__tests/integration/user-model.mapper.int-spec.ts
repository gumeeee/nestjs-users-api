/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { PrismaClient, User } from '@prisma/client';
import { UserModelMapper } from '../../user-model.mapper';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();

    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: '2ce25a83-7876-4424-a951-67f962971a50',
      name: 'Test name',
      email: 'test@email.com',
      password: 'testpassword',
      created_at: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws error when user model is invalid', () => {
    const model: User = Object.assign(props, {
      name: null,
    });

    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError);
  });

  it('should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({
      data: {
        ...props,
      },
    });

    const sut = UserModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJSON()).toEqual(props);
  });
});
