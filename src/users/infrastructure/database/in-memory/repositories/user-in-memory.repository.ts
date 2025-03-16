import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { inMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export class InMemoryUserRepository
  extends inMemoryRepository<UserEntity>
  implements UserRepository
{
  // eslint-disable-next-line @typescript-eslint/require-await
  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(item => item.email === email);

    if (!entity) {
      throw new NotFoundError(`Entity not found using email: ${email}`);
    }

    return entity;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async emailExists(email: string): Promise<void> {
    const entity = this.items.find(item => item.email === email);

    if (!entity) {
      throw new ConflictError('Email adress already used by another user');
    }
  }
}
