import { UserOutput } from '@/users/application/dtos/user-output';
import { UserPresenter } from '../../user.presenter';

describe('UserPresenter unit tests', () => {
  const props: UserOutput = {
    id: '733a52a8-fccf-44aa-976c-fda7b8fe1697',
    name: 'Test name',
    password: 'test@password',
    email: 'test@email.com',
    created_at: new Date(),
  };

  describe('constructor method', () => {
    it('should be defined', () => {
      const sut = new UserPresenter(props);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.created_at).toEqual(props.created_at);
    });
  });
});
