/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/await-thenable */
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  describe('findByEmail method', () => {
    it('Should throw error when not found', async () => {
      await expect(sut.findByEmail('test@email.com')).rejects.toThrow(
        new NotFoundError('Entity not found using email: test@email.com'),
      );
    });

    it('Should find a entity by email', async () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      await sut.insert(userEntity);
      const foundEntity = await sut.findByEmail(userEntity.email);

      expect(foundEntity.toJSON()).toStrictEqual(userEntity.toJSON());
    });
  });

  describe('emailExists method', () => {
    it('Should throw error when conflict', async () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      await sut.insert(userEntity);

      await expect(sut.emailExists(userEntity.email)).rejects.toThrow(
        new ConflictError('Email adress already used by another user'),
      );
    });

    it('Should not throw error when not conflict', async () => {
      expect.assertions(0);
      await sut.emailExists('test@email.com');
    });
  });

  describe('applyFilter method', () => {
    it('Should no filter items when filter object is null', async () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      await sut.insert(userEntity);
      const result = await sut.findAll();
      const spyFilter = jest.spyOn(result, 'filter');
      const itemsFiltered = await sut['applyFilter'](result, null as any);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual(result);
    });

    it('Should filter name field using filter param', async () => {
      const items = [
        new UserEntity(UserDataBuilder({ name: 'test' })),
        new UserEntity(UserDataBuilder({ name: 'fake name' })),
        new UserEntity(UserDataBuilder({ name: 'TEST' })),
        new UserEntity(UserDataBuilder({ name: 'Test' })),
      ];
      const spyFilter = jest.spyOn(items, 'filter');
      const itemsFiltered = await sut['applyFilter'](items, 'TEST');

      expect(spyFilter).toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual([items[0], items[2], items[3]]);
    });
  });

  describe('applySort method', () => {
    it('Should sort by created_at when sort param is null', async () => {
      const created_at = new Date();
      const items = [
        new UserEntity(UserDataBuilder({ name: 'test', created_at })),
        new UserEntity(
          UserDataBuilder({
            name: 'TEST',
            created_at: new Date(created_at.getTime() + 1),
          }),
        ),
        new UserEntity(
          UserDataBuilder({
            name: 'fake',
            created_at: new Date(created_at.getTime() + 2),
          }),
        ),
      ];
      const itemsSorted = await sut['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('Should sort by created_at when sort param is not null', async () => {
      const created_at = new Date();
      const items = [
        new UserEntity(UserDataBuilder({ name: 'test', created_at })),
        new UserEntity(
          UserDataBuilder({
            name: 'TEST',
            created_at: new Date(created_at.getTime() + 1),
          }),
        ),
        new UserEntity(
          UserDataBuilder({
            name: 'fake',
            created_at: new Date(created_at.getTime() + 2),
          }),
        ),
      ];
      let itemsSorted = await sut['applySort'](items, 'created_at', 'asc');
      expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);

      itemsSorted = await sut['applySort'](items, 'created_at', null);
      expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('Should sort by name field', async () => {
      const items = [
        new UserEntity(UserDataBuilder({ name: 'c' })),
        new UserEntity(
          UserDataBuilder({
            name: 'd',
          }),
        ),
        new UserEntity(
          UserDataBuilder({
            name: 'a',
          }),
        ),
      ];
      let itemsSorted = await sut['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

      itemsSorted = await sut['applySort'](items, 'name', null);
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
    });
  });
});
