/* eslint-disable @typescript-eslint/no-floating-promises */
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { SignupUseCase } from '../../signup.usecase';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { BadRequestError } from '@/users/application/errors/bad-request-error';

describe('SignupUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignupUseCase.UseCase(repository, hashProvider);
  });
  it('Should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const hashSpy = jest.spyOn(hashProvider, 'generateHash');
    const props = UserDataBuilder({});
    const result = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    });

    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledTimes(1);
  });

  it('Should not be able to register with same email twice', async () => {
    const props = UserDataBuilder({ email: 'test@email.com' });
    await sut.execute(props);

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError);
  });

  it('Should throws error when name not provided', () => {
    const props = Object.assign(UserDataBuilder({}), {
      name: '',
    });

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });

  it('Should throws error when email not provided', () => {
    const props = Object.assign(UserDataBuilder({}), {
      email: '',
    });

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });

  it('Should throws error when password not provided', () => {
    const props = Object.assign(UserDataBuilder({}), {
      password: '',
    });

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });
});
