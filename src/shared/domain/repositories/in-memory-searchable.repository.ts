import { Entity } from '../entity/entity';
import { inMemoryRepository } from './in-memory.repository';
import { SearchableRepositoryInterface } from './searchable-repository-contracts';

export abstract class inMemorySearchableRepository<E extends Entity>
  extends inMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  search(props: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  items: E[] = [];
}
