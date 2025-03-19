import { Entity } from '../entity/entity';
import { RepositoryInterface } from './repository-contracts';

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  pageSize?: number;
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams {
  protected _page: number;
  protected _pageSize: number = 15;
  protected _sort: string | null;
  protected _sortDirection: SortDirection | null;
  protected _filter: string | null;

  constructor(props: SearchProps) {
    this._page = props.page ?? 1;
    this._pageSize = props.pageSize ?? 15;
    this._sort = props.sort ?? null;
    this._sortDirection = props.sortDirection ?? null;
    this._filter = props.filter ?? null;
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number) {}

  get pageSize(): number {
    return this._pageSize;
  }

  private set pageSize(value: number) {}

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null) {}

  get sortDirection(): SortDirection | null {
    return this._sortDirection;
  }

  private set sortDirection(value: string | null) {}

  get filter(): string | null {
    return this._filter;
  }

  private set filter(value: string | null) {}
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SerchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SerchOutput>;
}
