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
});
