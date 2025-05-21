/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UserOutput } from '@/users/application/dtos/user-output';
import { instanceToPlain } from 'class-transformer';
import { UserCollectionPresenter, UserPresenter } from '../../user.presenter';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';

describe('UserPresenter unit tests', () => {
  const created_at = new Date();
  const props: UserOutput = {
    id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
    name: 'Test name',
    password: 'test@password',
    email: 'test@email.com',
    created_at,
  };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor method', () => {
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.created_at).toEqual(props.created_at);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
        name: 'Test name',
        email: 'test@email.com',
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('UserCollectionPresenter unit tests', () => {
  const created_at = new Date();
  const props: UserOutput = {
    id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
    name: 'Test name',
    password: 'test@password',
    email: 'test@email.com',
    created_at,
  };

  describe('constructor method', () => {
    it('should be defined', () => {
      const sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        pageSize: 1,
        lastPage: 1,
        total: 1,
      });

      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          pageSize: 1,
          lastPage: 1,
          total: 1,
        }),
      );
      expect(sut.data).toStrictEqual([new UserPresenter(props)]);
    });

    it('should presenter data', () => {
      let sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        pageSize: 2,
        lastPage: 1,
        total: 1,
      });

      let output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [
          {
            id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
            name: 'Test name',
            email: 'test@email.com',
            created_at: created_at.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          pageSize: 2,
          lastPage: 1,
          total: 1,
        },
      });

      sut = new UserCollectionPresenter({
        items: [props],
        currentPage: '1' as any,
        pageSize: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      });

      output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        data: [
          {
            id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
            name: 'Test name',
            email: 'test@email.com',
            created_at: created_at.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          pageSize: 2,
          lastPage: 1,
          total: 1,
        },
      });
    });
  });
});
