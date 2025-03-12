import { Entity } from '../entity/entity';
import { RepositoryInterface } from './repository-contracts';

export abstract class inMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<E> {
    const _id = `${id}`;
    const entity = this.items.find(item => item.id === _id);

    if (!entity) {
      throw new Error('Entity not found');
    }

    return entity;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findAll(): Promise<E[]> {
    return this.items;
  }

  update(entity: E): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
