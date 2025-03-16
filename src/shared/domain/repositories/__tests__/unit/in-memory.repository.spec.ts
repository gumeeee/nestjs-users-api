import { Entity } from '@/shared/domain/entity/entity';
import { inMemoryRepository } from '../../in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends inMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('Should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'test nam', price: 77 });
    await sut.insert(entity);

    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });

  it('Should throw error when entity not found', async () => {
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should find a entity by id', async () => {
    const entity = new StubEntity({ name: 'test name', price: 77 });
    await sut.insert(entity);

    const result = await sut.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(result.toJSON());
  });

  it('Should return all entities', async () => {
    const entity = new StubEntity({ name: 'test name', price: 77 });
    await sut.insert(entity);

    const result = await sut.findAll();
    expect([entity]).toStrictEqual(result);
  });

  it('Should find all return not entities', async () => {
    const result = await sut.findAll();

    expect(result).toStrictEqual([]);
  });
});
