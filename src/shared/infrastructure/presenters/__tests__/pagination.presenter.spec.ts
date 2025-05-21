/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../pagination.presenter';

describe('PaginationPresenter unit tests', () => {
  describe('constructor method', () => {
    it('should set values', () => {
      const sut = new PaginationPresenter({
        currentPage: 1,
        pageSize: 2,
        lastPage: 3,
        total: 4,
      });

      expect(sut.currentPage).toEqual(1);
      expect(sut.pageSize).toEqual(2);
      expect(sut.lastPage).toEqual(3);
      expect(sut.total).toEqual(4);
    });

    it('should set string values', () => {
      const sut = new PaginationPresenter({
        currentPage: '1' as any,
        pageSize: '2' as any,
        lastPage: '3' as any,
        total: '4' as any,
      });

      expect(sut.currentPage).toEqual('1');
      expect(sut.pageSize).toEqual('2');
      expect(sut.lastPage).toEqual('3');
      expect(sut.total).toEqual('4');
    });

    it('should presenter data', () => {
      let sut = new PaginationPresenter({
        currentPage: 1,
        pageSize: 2,
        lastPage: 3,
        total: 4,
      });

      let output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        currentPage: 1,
        pageSize: 2,
        lastPage: 3,
        total: 4,
      });

      sut = new PaginationPresenter({
        currentPage: '1' as any,
        pageSize: '2' as any,
        lastPage: '3' as any,
        total: '4' as any,
      });

      output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        currentPage: 1,
        pageSize: 2,
        lastPage: 3,
        total: 4,
      });
    });
  });
});
