import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator';

let sut: UserValidator;

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create();
  });

  it('Should valid cases for user validator class', () => {
    const props = UserDataBuilder({});

    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new UserRules(props));
    expect(sut.errors['name']).toStrictEqual(undefined);
  });

  describe('Name field', () => {
    it('Should Invalidation cases for name field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      let isValid = sut.validate(null as any);
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        name: '',
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: 100 as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('Email field', () => {
    it('Should Invalidation cases for email field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      let isValid = sut.validate(null as any);
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'email must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        email: '',
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email should not be empty',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email: 100 as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be a string',
        'email must be shorter than or equal to 255 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('Password field', () => {
    it('Should Invalidantion cases for password field', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      let isValid = sut.validate(null as any);
      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        password: '',
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: 100 as any,
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);

      isValid = sut.validate({
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      });
      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ]);
    });
  });
});
