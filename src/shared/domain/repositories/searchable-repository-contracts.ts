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

  private set page(value: number) {
    let _page = +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  private set pageSize(value: number) {
    let _pageSize = +value;
    if (
      Number.isNaN(_pageSize) ||
      _pageSize <= 0 ||
      parseInt(_pageSize as any) !== _pageSize
    ) {
      _pageSize = this._pageSize;
    }

    this._pageSize = _pageSize;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection;
  }

  private set sortDirection(value: string | null) {
    if (!this.sort) {
      this._sortDirection = null;
      return;
    }

    const dir = `${value}`.toLowerCase();
    this._sortDirection = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  get filter(): string | null {
    return this._filter;
  }

  private set filter(value: string | null) {
    this._filter =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SerchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SerchOutput>;
}
