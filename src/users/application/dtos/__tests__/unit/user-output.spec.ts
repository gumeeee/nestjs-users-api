import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserOutputMapper } from '../../user-output';

describe('UserOutputMapper unit test', () => {
  it('should convert a userEntity to UserOutput', () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const spyToJson = jest.spyOn(entity, 'toJSON');
    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalledTimes(1);
    expect(sut).toEqual(entity.toJSON());
  });
});
