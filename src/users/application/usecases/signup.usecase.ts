import { UserRepository } from '@/users/domain/repositories/user.repository';
import { BadRequestError } from '../errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: Date;
  };

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input;

      if (!email || !name || !password) {
        throw new BadRequestError('Fields data not provided');
      }

      await this.userRepository.emailExists(email);

      const entity = new UserEntity(input);

      await this.userRepository.insert(entity);

      return entity.toJSON();
    }
  }
}
