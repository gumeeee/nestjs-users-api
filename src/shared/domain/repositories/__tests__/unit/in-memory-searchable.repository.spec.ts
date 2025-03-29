/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entity } from '@/shared/domain/entity/entity';
import { inMemorySearchableRepository } from '../../in-memory-searchable.repository';
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends inMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'value test', price: 7 })];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      const itemsFiltered = await sut['applyFilter'](items, null);

      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 7 }),
        new StubEntity({ name: 'TEST', price: 7 }),
        new StubEntity({ name: 'fake', price: 7 }),
        new StubEntity({ name: 'tEsT', price: 7 }),
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      let itemsFiltered = await sut['applyFilter'](items, 'TEST');
      expect(itemsFiltered).toStrictEqual([items[0], items[1], items[3]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await sut['applyFilter'](items, 'test');
      expect(itemsFiltered).toStrictEqual([items[0], items[1], items[3]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await sut['applyFilter'](items, 'no-filter');
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 7 }),
        new StubEntity({ name: 'c', price: 7 }),
        new StubEntity({ name: 'a', price: 7 }),
      ];

      let itemsSorted = await sut['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await sut['applySort'](items, 'price', 'asc');
      expect(itemsSorted).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 7 }),
        new StubEntity({ name: 'c', price: 7 }),
        new StubEntity({ name: 'a', price: 7 }),
      ];

      let itemsSorted = await sut['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

      itemsSorted = await sut['applySort'](items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
    });
  });

  describe('applyPagination method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 7 }),
        new StubEntity({ name: 'b', price: 7 }),
        new StubEntity({ name: 'c', price: 7 }),
        new StubEntity({ name: 'd', price: 7 }),
        new StubEntity({ name: 'e', price: 7 }),
        new StubEntity({ name: 'f', price: 7 }),
        new StubEntity({ name: 'g', price: 7 }),
        new StubEntity({ name: 'h', price: 7 }),
        new StubEntity({ name: 'h', price: 7 }),
      ];

      let itemsPaginated = await sut['applyPagination'](items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await sut['applyPagination'](items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await sut['applyPagination'](items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4], items[5]]);

      itemsPaginated = await sut['applyPagination'](items, 4, 2);
      expect(itemsPaginated).toStrictEqual([items[6], items[7]]);

      itemsPaginated = await sut['applyPagination'](items, 5, 2);
      expect(itemsPaginated).toStrictEqual([items[8]]);

      itemsPaginated = await sut['applyPagination'](items, 6, 2);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should apply only pagination when the other params are null', async () => {
      const entity = new StubEntity({ name: 'test', price: 7 });
      const items: StubEntity[] = Array(16).fill(entity);
      sut.items = items;

      const params = await sut.search(new SearchParams());
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          pageSize: 15,
          sort: null,
          sortDirection: null,
          filter: null,
        }),
      );
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 7 }),
        new StubEntity({ name: 'a', price: 7 }),
        new StubEntity({ name: 'tEsT', price: 7 }),
        new StubEntity({ name: 'TEST', price: 7 }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          pageSize: 2,
          filter: 'TEST',
        }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          pageSize: 2,
          sort: null,
          sortDirection: null,
          filter: 'TEST',
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          pageSize: 2,
          filter: 'TEST',
        }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          pageSize: 2,
          sort: null,
          sortDirection: null,
          filter: 'TEST',
        }),
      );
    });
  });
});
