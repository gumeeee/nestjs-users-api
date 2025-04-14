import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { ListUsersUseCase } from '../../listusers.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('ListUsersUseCase unit test', () => {
  let sut: ListUsersUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUseCase.UseCase(repository);
  });
  it('toOutput method', () => {
    let searchResult = new UserRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      pageSize: 2,
      sort: null,
      sortDirection: null,
      filter: null,
    });

    let output = sut['toOutput'](searchResult);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      pageSize: 2,
    });

    const userEntity = new UserEntity(UserDataBuilder({}));
    searchResult = new UserRepository.SearchResult({
      items: [userEntity],
      total: 1,
      currentPage: 1,
      pageSize: 2,
      sort: null,
      sortDirection: null,
      filter: null,
    });

    output = sut['toOutput'](searchResult);
    expect(output).toStrictEqual({
      items: [userEntity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      pageSize: 2,
    });
  });

  it('should return a list of users ordered by created_at', async () => {
    const created_at = new Date();
    const items = [
      new UserEntity(UserDataBuilder({ created_at })),
      new UserEntity(
        UserDataBuilder({ created_at: new Date(created_at.getTime() + 1) }),
      ),
    ];

    repository.items = items;
    const output = await sut.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      pageSize: 15,
    });
  });

  it('should return a list of users using pagination, sort and filter', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'aA' })),
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'c' })),
      new UserEntity(UserDataBuilder({ name: 'b' })),
    ];

    repository.items = items;
    const output = await sut.execute({
      page: 1,
      pageSize: 2,
      sort: 'name',
      sortDirection: 'asc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[2].toJSON(), items[0].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      pageSize: 2,
    });
  });
});
