import { Entity } from '../entity/entity';
import { NotFoundError } from '../errors/not-found-error';
import { RepositoryInterface } from './repository-contracts';

export abstract class inMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: string): Promise<E> {
    const entity = await this._get(id);
    return entity;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const index = this.items.findIndex(item => item.id === entity.id);
    this.items[index] = entity;
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    const index = this.items.findIndex(item => item.id === id);
    this.items.splice(index, 1);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async _get(id: string): Promise<E> {
    const _id = `${id}`;
    const entity = this.items.find(item => item.id === _id);

    if (!entity) {
      throw new NotFoundError('Entity not found');
    }

    return entity;
  }
}
