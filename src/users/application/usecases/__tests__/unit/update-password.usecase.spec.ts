import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UpdatePasswordUseCase } from '../../update-password.usecase';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
  });

  it('Should throw error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'fakeId',
        newPassword: 'test password',
        oldPassword: 'test password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throw error when field old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    repository.items = [entity];

    await expect(() =>
      sut.execute({
        id: entity.id,
        newPassword: 'test password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old and new passwords are required'),
    );
  });

  it('Should throw error when field new password not provided', async () => {
    const entity = new UserEntity(
      UserDataBuilder({ password: 'test password' }),
    );
    repository.items = [entity];

    await expect(() =>
      sut.execute({
        id: entity.id,
        newPassword: '',
        oldPassword: 'test password',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old and new passwords are required'),
    );
  });

  it('Should throw error when old password does not match', async () => {
    const hashedPassword = await hashProvider.generateHash('test password');
    const entity = new UserEntity(
      UserDataBuilder({ password: hashedPassword }),
    );
    repository.items = [entity];

    const spyCompareHash = jest.spyOn(hashProvider, 'compareHash');

    await expect(() =>
      sut.execute({
        id: entity.id,
        newPassword: 'new password',
        oldPassword: 'test password123',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'));
    expect(spyCompareHash).toHaveBeenCalledWith(
      'test password123',
      hashedPassword,
    );
  });

  it('Should update a user', async () => {
    const hashedPassword = await hashProvider.generateHash('test password');

    const spyFindById = jest.spyOn(repository, 'findById');
    const spyUpdate = jest.spyOn(repository, 'update');
    const spyCompareHash = jest.spyOn(hashProvider, 'compareHash');

    const items = [
      new UserEntity(UserDataBuilder({ password: hashedPassword })),
    ];
    repository.items = items;

    const result = await sut.execute({
      id: items[0].id,
      newPassword: 'new password',
      oldPassword: 'test password',
    });

    const checNewPasswordHash = await hashProvider.compareHash(
      'new password',
      result.password,
    );

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(spyCompareHash).toHaveBeenCalledWith(
      'test password',
      hashedPassword,
    );
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(checNewPasswordHash).toBeTruthy();
  });
});
