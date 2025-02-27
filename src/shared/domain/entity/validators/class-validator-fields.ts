import { validateSync } from 'class-validator';
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface';

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = {};
  validatedData: PropsValidated = {} as PropsValidated;

  validate(data: any): boolean {
    const errors = validateSync(data);

    if (errors.length) {
      for (const error of errors) {
        const field = error.property;
        if (error.constraints) {
          this.errors[field] = Object.values(error.constraints);
        }
      }
    } else {
      this.validatedData = data as PropsValidated;
    }

    return !errors.length;
  }
}
