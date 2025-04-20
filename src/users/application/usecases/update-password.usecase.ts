import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { IUseCase } from '@/shared/application/usecases/use-case';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';

export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string;
    newPassword: string;
    oldPassword: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);

      if (!input.newPassword || !input.oldPassword) {
        throw new InvalidPasswordError('Old and new passwords are required');
      }

      const isOldPasswordValid = await this.hashProvider.compareHash(
        input.oldPassword,
        entity.password,
      );

      if (!isOldPasswordValid) {
        throw new InvalidPasswordError('Old password does not match');
      }

      const newPasswordHash = await this.hashProvider.generateHash(
        input.newPassword,
      );

      entity.updatePassword(newPasswordHash);
      await this.userRepository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
