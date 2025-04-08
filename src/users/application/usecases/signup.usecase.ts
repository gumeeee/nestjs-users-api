import { UserRepository } from '@/users/domain/repositories/user.repository';
import { BadRequestError } from '../errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UserOutput } from '../dtos/user-output';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase {
    constructor(
      private userRepository: UserRepository.Repository,
      private bcryptHashProvider: BcryptjsHashProvider,
    ) {}
    async execute(input: Input): Promise<Output> {
      const { name, email, password } = input;

      if (!email || !name || !password) {
        throw new BadRequestError('Fields data not provided');
      }

      await this.userRepository.emailExists(email);

      const hashPassword = await this.bcryptHashProvider.generateHash(password);

      const entity = new UserEntity(
        Object.assign(input, {
          password: hashPassword,
        }),
      );

      await this.userRepository.insert(entity);

      return entity.toJSON();
    }
  }
}
