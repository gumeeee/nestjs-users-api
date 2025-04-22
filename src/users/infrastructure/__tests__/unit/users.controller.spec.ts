/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { SignupDto } from '../../dtos/signup.dto';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(() => {
    sut = new UsersController();
    id = '2ce25a83-7876-4424-a951-67f962971a50';
    props = {
      id,
      name: 'Test name',
      email: 'test@email.com',
      password: 'testpassword',
      created_at: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const output: SignupUseCase.Output = props;
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['signupUseCase'] = mockSignupUseCase as any;

    const input: SignupDto = {
      name: 'Test name',
      email: 'test@email.com',
      password: 'testpassword',
    };
    const result = await sut.create(input);

    expect(output).toMatchObject(result);
    expect(mockSignupUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });
});
