/* eslint-disable @typescript-eslint/require-await */
import { Entity } from '../entity/entity';
import { inMemoryRepository } from './in-memory.repository';
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from './searchable-repository-contracts';

export abstract class inMemorySearchableRepository<E extends Entity>
  extends inMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  sortableFields: string[] = [];

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sortDirection,
    );
    const itemsPaginated = await this.applyPagination(
      itemsSorted,
      props.page,
      props.pageSize,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      pageSize: props.pageSize,
      sort: props.sort,
      sortDirection: props.sortDirection,
      filter: props.filter,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDirection: string | null,
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (a.props[sort] < b.props[sort]) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (a.props[sort] > b.props[sort]) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    pageSize: SearchParams['pageSize'],
  ): Promise<E[]> {
    const start = (page - 1) * pageSize;
    const limit = start + pageSize;

    return items.slice(start, limit);
  }

  items: E[] = [];
}
