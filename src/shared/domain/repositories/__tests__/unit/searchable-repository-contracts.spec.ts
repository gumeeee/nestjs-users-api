/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entity } from '@/shared/domain/entity/entity';
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts';

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

    it('sort prop', () => {
      const sut = new SearchParams();
      expect(sut.sort).toBeNull();

      const params = [
        { sort: null as any, expected: null },
        { sort: undefined as any, expected: null },
        { sort: '', expected: null },
        { sort: 'teste', expected: 'teste' },
        { sort: 0, expected: '0' },
        { sort: -15, expected: '-15' },
        { sort: 7.7, expected: '7.7' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
        { sort: 20, expected: '20' },
      ];

      params.forEach(param => {
        expect(new SearchParams({ sort: param.sort }).sort).toBe(
          param.expected,
        );
      });
    });

    it('sortDirection prop', () => {
      let sut = new SearchParams();
      expect(sut.sortDirection).toBeNull();

      sut = new SearchParams({ sort: null });
      expect(sut.sortDirection).toBeNull();

      sut = new SearchParams({ sort: undefined });
      expect(sut.sortDirection).toBeNull();

      sut = new SearchParams({ sort: '' });
      expect(sut.sortDirection).toBeNull();

      const params = [
        { sortDirection: null as any, expected: 'desc' },
        { sortDirection: undefined as any, expected: 'desc' },
        { sortDirection: '', expected: 'desc' },
        { sortDirection: 'teste', expected: 'desc' },
        { sortDirection: 0, expected: 'desc' },
        { sortDirection: -15, expected: 'desc' },
        { sortDirection: 7.7, expected: 'desc' },
        { sortDirection: 'asc', expected: 'asc' },
        { sortDirection: 'desc', expected: 'desc' },
        { sortDirection: 'ASC', expected: 'asc' },
        { sortDirection: 'DESC', expected: 'desc' },
      ];

      params.forEach(param => {
        expect(
          new SearchParams({
            sort: 'field',
            sortDirection: param.sortDirection,
          }).sortDirection,
        ).toBe(param.expected);
      });
    });

    it('filter prop', () => {
      const sut = new SearchParams();
      expect(sut.filter).toBeNull();

      const params = [
        { filter: null as any, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '', expected: null },
        { filter: 'teste', expected: 'teste' },
        { filter: 0, expected: 0 },
        { filter: -15, expected: -15 },
        { filter: 7.7, expected: 7.7 },
        { filter: true, expected: true },
        { filter: false, expected: false },
        { filter: {}, expected: {} },
        { filter: 1, expected: 1 },
        { filter: 2, expected: 2 },
        { filter: 20, expected: 20 },
      ];

      params.forEach(param => {
        const result = new SearchParams({ filter: param.filter }).filter;
        if (typeof param.expected === 'object' && param.expected !== null) {
          expect(result).toStrictEqual(param.expected);
        } else {
          expect(result).toBe(param.expected);
        }
      });
    });
  });

  describe('SearchResult tests', () => {
    it('constructor props', () => {
      let sut = new SearchResult({
        items: ['propstest1', 'propstest2', 'propstest3', 'propstest4'] as any,
        total: 4,
        currentPage: 1,
        pageSize: 2,
        sort: null,
        sortDirection: null,
        filter: null,
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['propstest1', 'propstest2', 'propstest3', 'propstest4'] as any,
        total: 4,
        currentPage: 1,
        pageSize: 2,
        lastPage: 2,
        sort: null,
        sortDirection: null,
        filter: null,
      });

      sut = new SearchResult<Entity<string>, null>({
        items: ['propstest1', 'propstest2', 'propstest3', 'propstest4'] as any,
        total: 4,
        currentPage: 1,
        pageSize: 2,
        sort: 'name',
        sortDirection: 'asc',
        filter: 'test' as any,
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['propstest1', 'propstest2', 'propstest3', 'propstest4'] as any,
        total: 4,
        currentPage: 1,
        pageSize: 2,
        lastPage: 2,
        sort: 'name',
        sortDirection: 'asc',
        filter: 'test',
      });

      sut = new SearchResult<Entity<string>, null>({
        items: ['propstest1', 'propstest2', 'propstest3', 'propstest4'] as any,
        total: 4,
        currentPage: 1,
        pageSize: 10,
        sort: 'name',
        sortDirection: 'asc',
        filter: 'test' as any,
      });

      expect(sut.lastPage).toBe(1);

      sut = new SearchResult<Entity<string>, null>({
        items: ['propstest1', 'propstest2', 'propstest3', 'propstest4'] as any,
        total: 54,
        currentPage: 1,
        pageSize: 10,
        sort: 'name',
        sortDirection: 'asc',
        filter: 'test' as any,
      });

      expect(sut.lastPage).toBe(6);
    });
  });
});
