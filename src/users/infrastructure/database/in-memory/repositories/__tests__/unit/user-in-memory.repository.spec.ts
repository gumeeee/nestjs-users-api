/* eslint-disable @typescript-eslint/await-thenable */
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('Should throw error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('test@email.com')).rejects.toThrow(
      new NotFoundError('Entity not found using email: test@email.com'),
    );
  });

  it('Should find a entity by email - findByEmail method', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await sut.insert(userEntity);
    const foundEntity = await sut.findByEmail(userEntity.email);

    expect(foundEntity.toJSON()).toStrictEqual(userEntity.toJSON());
  });

  it('Should throw error when conflict - emailExists method', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await sut.insert(userEntity);

    await expect(sut.emailExists(userEntity.email)).rejects.toThrow(
      new ConflictError('Email adress already used by another user'),
    );
  });

  it('Should throw error when conflict - emailExists method', async () => {
    expect.assertions(0);
    await sut.emailExists('test@email.com');
  });
});
