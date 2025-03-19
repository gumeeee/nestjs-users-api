/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SearchParams } from '../../searchable-repository-contracts';

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('page prop', () => {
      const sut = new SearchParams();
      expect(sut.page).toBe(1);

      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '', expected: 1 },
        { page: 'teste', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 7.7, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ];

      params.forEach(param => {
        expect(new SearchParams({ page: param.page }).page).toBe(
          param.expected,
        );
      });
    });

    it('pageSize prop', () => {
      const sut = new SearchParams();
      expect(sut.pageSize).toBe(15);

      const params = [
        { pageSize: null as any, expected: 15 },
        { pageSize: undefined as any, expected: 15 },
        { pageSize: '', expected: 15 },
        { pageSize: 'teste', expected: 15 },
        { pageSize: 0, expected: 15 },
        { pageSize: -15, expected: 15 },
        { pageSize: 7.7, expected: 15 },
        { pageSize: true, expected: 15 },
        { pageSize: false, expected: 15 },
        { pageSize: {}, expected: 15 },
        { pageSize: 1, expected: 1 },
        { pageSize: 2, expected: 2 },
        { pageSize: 20, expected: 20 },
      ];

      params.forEach(param => {
        expect(new SearchParams({ pageSize: param.pageSize }).pageSize).toBe(
          param.expected,
        );
      });
    });
  });
});
