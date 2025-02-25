import { v4 as uuidv4 } from 'uuid';

export abstract class Entity<ClassProps = any> {
  public readonly _id: string;
  public readonly props: ClassProps;

  constructor(props: ClassProps, id?: string) {
    this._id = id ?? uuidv4();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  toJSON(): Required<{ id: string } & ClassProps> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & ClassProps>;
  }
}
