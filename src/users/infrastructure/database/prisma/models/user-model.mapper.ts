import { ValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { User } from '@prisma/client';

export class UserModelMapper {
  static toEntity(model: User): UserEntity {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      created_at: model.created_at,
    };

    try {
      return new UserEntity(data, model.id);
    } catch (error) {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
