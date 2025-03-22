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
  // eslint-disable-next-line @typescript-eslint/require-await
  async search(props: SearchParams): Promise<SearchResult<E>> {
    throw new Error('Method not implemented.');
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
    return Promise.resolve([]);
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    pageSize: SearchParams['pageSize'],
  ): Promise<E[]> {
    return Promise.resolve([]);
  }

  items: E[] = [];
}
