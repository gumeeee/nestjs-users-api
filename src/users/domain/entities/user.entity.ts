import { Entity } from '@/shared/domain/entity/entity';
import {
  UserValidator,
  UserValidatorFactory,
} from '../validators/user.validator';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  created_at?: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate(props);
    super(props, id);
    this.props.created_at = this.props.created_at ?? new Date();
  }

  update(value: string): void {
    UserEntity.validate({ ...this.props, name: value });
    this.name = value;
  }

  updatePassword(value: string): void {
    UserEntity.validate({ ...this.props, password: value });
    this.password = value;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  get created_at() {
    return this.props.created_at;
  }

  static validate(props: UserProps) {
    const validator: UserValidator = UserValidatorFactory.create();
    validator.validate(props);
  }
}
