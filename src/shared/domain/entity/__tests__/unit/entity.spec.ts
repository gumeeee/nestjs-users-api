import { validate as uuidValidate } from 'uuid';
import { Entity } from '../../entity';

type StubProps = {
  field1: string;
  field2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  let props: StubProps;
  let entity: StubEntity;
  let id: string;

  beforeEach(() => {
    props = {
      field1: 'field1',
      field2: 1,
    };
    id = '96cf2d3a-8f51-494d-afa9-414e910fe2b4';
    entity = new StubEntity(props);
  });

  it('Should set props and id', () => {
    expect(entity.props).toStrictEqual(props);
    expect(entity._id).not.toBeNull();
    expect(uuidValidate(entity._id)).toBeTruthy();
  });

  it('Should accept a valid uuid', () => {
    entity = new StubEntity(props, id);

    expect(uuidValidate(entity._id)).toBeTruthy();
    expect(entity._id).toBe(id);
  });

  it('Should convert a entity to a JSON', () => {
    entity = new StubEntity(props, id);

    expect(entity.toJSON()).toStrictEqual({ id, ...props });
  });
});
