/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';
import { PaginationOutputMapper } from '../pagination-output';

describe('PaginationOutput unit test', () => {
  it('should convert a SearchResult to Output', () => {
    const searchResult = new SearchResult({
      items: ['fakeItem'] as any,
      total: 1,
      currentPage: 1,
      pageSize: 1,
      sort: '',
      sortDirection: '',
      filter: 'fake',
    });

    const sut = PaginationOutputMapper.toOutput(
      searchResult.items,
      searchResult,
    );

    const expected = {
      items: searchResult.items,
      total: searchResult.total,
      currentPage: searchResult.currentPage,
      lastPage: searchResult.lastPage,
      pageSize: searchResult.pageSize,
    };

    expect(sut).toStrictEqual(expected);
  });
});
