import { UserOutput } from '@/users/application/dtos/user-output';
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
