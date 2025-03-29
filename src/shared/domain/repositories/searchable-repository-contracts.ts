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

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  currentPage: number;
  pageSize: number;
  sort: string | null;
  sortDirection: string | null;
  filter: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _pageSize: number = 15;
  protected _sort: string | null;
  protected _sortDirection: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page ?? 1;
    this.pageSize = props.pageSize ?? 15;
    this.sort = props.sort ?? null;
    this.sortDirection = props.sortDirection ?? null;
    this.filter = props.filter ?? null;
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number) {
    let _page = value === (true as any) ? this._page : +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  private set pageSize(value: number) {
    let _pageSize = value === (true as any) ? this._pageSize : +value;
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

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || value === '' ? null : value;
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly pageSize: number;
  readonly lastPage: number;
  readonly sort: string | null;
  readonly sortDirection: string | null;
  readonly filter: Filter | null;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.pageSize = props.pageSize;
    this.lastPage = Math.ceil(this.total / this.pageSize);
    this.sort = props.sort ?? null;
    this.sortDirection = props.sortDirection ?? null;
    this.filter = props.filter ?? null;
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDirection: this.sortDirection,
      filter: this.filter,
    };
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SerchOutput = SearchResult<E, Filter>,
> extends RepositoryInterface<E> {
  sortableFields: string[];

  search(props: SearchInput): Promise<SerchOutput>;
}
