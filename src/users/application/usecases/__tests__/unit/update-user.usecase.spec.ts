import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdateUserUseCase } from '../../update-user.usecase';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase.UseCase(repository);
  });

  it('Should throw error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fakeId', name: 'test name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throw error when field name not provided', async () => {
    await expect(() => sut.execute({ id: 'fakeId', name: '' })).rejects.toThrow(
      new BadRequestError('Name is required'),
    );
  });

  it('Should update a user', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;

    const result = await sut.execute({ id: items[0].id, name: 'new name' });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new name',
      email: items[0].email,
      password: items[0].password,
      created_at: items[0].created_at,
    });
  });
});
