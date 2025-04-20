/* eslint-disable @typescript-eslint/no-floating-promises */
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { SigninUseCase } from '../../signin.usecase';

describe('SigninUseCase unit tests', () => {
  let sut: SigninUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SigninUseCase.UseCase(repository, hashProvider);
  });
  it('Should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const compareHashSpy = jest.spyOn(hashProvider, 'compareHash');

    const hashPassword = await hashProvider.generateHash('test password');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@email.com', password: hashPassword }),
    );
    repository.items.push(entity);

    const result = await sut.execute({
      email: entity.email,
      password: 'test password',
    });

    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(compareHashSpy).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJSON());
  });

  it('Should throws error when email not provided', () => {
    const props = {
      email: '',
      password: 'test password',
    };

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });

  it('Should throws error when password not provided', () => {
    const props = {
      email: 'test@email.com',
      password: '',
    };

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError);
  });

  it('Should not be able to authenticate with wrong email', () => {
    const props = {
      email: 'test@email.com',
      password: 'test password',
    };

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('test password');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@email.com', password: hashPassword }),
    );
    repository.items.push(entity);

    const props = {
      email: entity.email,
      password: 'fake password',
    };

    expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
