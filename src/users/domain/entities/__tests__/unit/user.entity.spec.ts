import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('User Entity', () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(() => {
    UserEntity.validate = jest.fn();
    props = UserDataBuilder({});
    sut = new UserEntity(props);
  });

  it('constructor method', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.created_at).toBeInstanceOf(Date);
  });

  it('Getter of name field', () => {
    expect(sut.props.name).toBeDefined();
    expect(sut.props.name).toEqual(props.name);
    expect(typeof sut.props.name).toBe('string');
  });

  it('Setter of name field', () => {
    sut['name'] = 'new name';
    expect(sut.props.name).toEqual('new name');
    expect(typeof sut.props.name).toBe('string');
  });

  it('Getter of email field', () => {
    expect(sut.props.email).toBeDefined();
    expect(sut.props.email).toEqual(props.email);
    expect(typeof sut.props.email).toBe('string');
  });

  it('Getter of password field', () => {
    expect(sut.props.password).toBeDefined();
    expect(sut.props.password).toEqual(props.password);
    expect(typeof sut.props.password).toBe('string');
  });

  it('Setter of password field', () => {
    sut['password'] = 'new password';
    expect(sut.props.password).toEqual('new password');
    expect(typeof sut.props.password).toBe('string');
  });

  it('Getter of created_at field', () => {
    expect(sut.props.created_at).toBeDefined();
    expect(sut.props.created_at).toBeInstanceOf(Date);
  });

  it('Should update a user', () => {
    sut.update('new name');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual('new name');
  });

  it('Should update the password field', () => {
    sut.updatePassword('new password');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(UserEntity.validate).toHaveBeenCalled();
    expect(sut.props.password).toEqual('new password');
  });
});
