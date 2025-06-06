import { CollectionPresenter } from '@/shared/infrastructure/collection.presenter';
import { UserOutput } from '@/users/application/dtos/user-output';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { Transform } from 'class-transformer';

export class UserPresenter {
  id: string;
  name: string;
  email: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.created_at = output.created_at;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: ListUsersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new UserPresenter(item));
  }
}
