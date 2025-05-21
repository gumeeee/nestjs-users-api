/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../pagination.presenter';
import { UserPresenter } from '@/users/infrastructure/presenters/user.presenter';
import { CollectionPresenter } from '../../collection.presenter';

class StubCollectionPresente extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('PaginationPresenter unit tests', () => {
  let sut: StubCollectionPresente;

  beforeEach(() => {
    sut = new StubCollectionPresente({
      currentPage: 1,
      pageSize: 2,
      lastPage: 2,
      total: 4,
    });
  });

  describe('constructor method', () => {
    it('should set values', () => {
      expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter);
      expect(sut['paginationPresenter'].currentPage).toBe(1);
      expect(sut['paginationPresenter'].pageSize).toBe(2);
      expect(sut['paginationPresenter'].lastPage).toBe(2);
      expect(sut['paginationPresenter'].total).toBe(4);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [1, 2, 3],
        meta: {
          currentPage: 1,
          pageSize: 2,
          lastPage: 2,
          total: 4,
        },
      });
    });
  });
});
