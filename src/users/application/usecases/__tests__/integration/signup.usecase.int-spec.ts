import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { SignupUseCase } from '../../signup.usecase';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';

describe('SignupUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignupUseCase.UseCase;
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
    sut = new SignupUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should create a user', async () => {
    const props: SignupUseCase.Input = {
      name: 'test name',
      email: 'test@email.com',
      password: 'test@password123',
    };

    const output = await sut.execute(props);

    expect(output.id).toBeDefined();
    expect(output.created_at).toBeInstanceOf(Date);
  });
});
