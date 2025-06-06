import { Entity } from '@/shared/domain/entity/entity';
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts';

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  currentPage: number;
  lastPage: number;
  pageSize: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: SearchResult<Entity>,
  ): PaginationOutput<Item> {
    return {
      items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      pageSize: result.pageSize,
    };
  }
}
