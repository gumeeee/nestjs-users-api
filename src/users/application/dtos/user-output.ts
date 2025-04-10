import { UserEntity } from '@/users/domain/entities/user.entity';

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
};

export class UserOutputMapper {
  static toOutput(userEntity: UserEntity): UserOutput {
    return userEntity.toJSON();
  }
}
