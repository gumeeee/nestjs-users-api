import { IUseCase } from '@/shared/application/usecases/use-case';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { BadRequestError } from '../../../shared/application/errors/bad-request-error';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';

export namespace SigninUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private bcryptHashProvider: BcryptjsHashProvider,
    ) {}
    async execute(input: Input): Promise<Output> {
      const { email, password } = input;

      if (!email || !password) {
        throw new BadRequestError('Fields data not provided');
      }

      const userByEmail = await this.userRepository.findByEmail(email);

      const isPasswordValid = await this.bcryptHashProvider.compareHash(
        password,
        userByEmail.password,
      );

      if (!isPasswordValid) {
        throw new InvalidCredentialsError('Credentials invalid');
      }

      return UserOutputMapper.toOutput(userByEmail);
    }
  }
}
