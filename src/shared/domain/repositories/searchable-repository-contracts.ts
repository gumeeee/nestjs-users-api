import { Entity } from '../entity/entity';
import { RepositoryInterface } from './repository-contracts';

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SerchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchInput): Promise<SerchOutput>;
}
