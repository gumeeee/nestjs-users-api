import { UserOutput } from '@/users/application/dtos/user-output';
import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from '../../user.presenter';

describe('UserPresenter unit tests', () => {
  const created_at = new Date();
  const props: UserOutput = {
    id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
    name: 'Test name',
    password: 'test@password',
    email: 'test@email.com',
    created_at,
  };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor method', () => {
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.created_at).toEqual(props.created_at);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);

      expect(output).toStrictEqual({
        id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
        name: 'Test name',
        email: 'test@email.com',
        created_at: created_at.toISOString(),
      });
    });
  });
});
