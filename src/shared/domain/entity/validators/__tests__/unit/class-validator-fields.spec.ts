import { ClassValidatorFields } from '../../class-validator-fields';
import * as libClassValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string;
}> {}

describe('ClassValidatorFields unit tests', () => {
  let sut: StubClassValidatorFields;

  beforeEach(() => {
    sut = new StubClassValidatorFields();
  });

  it('Should initialize errors and validatedData with null', () => {
    expect(sut.errors).toEqual({});
    expect(sut.validatedData).toEqual({});
  });

  it('Should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([
      {
        property: 'field',
        constraints: {
          isRequired: 'field is required',
        },
      },
    ]);

    expect(sut.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.validatedData).toEqual({});
    expect(sut.errors).toEqual({ field: ['field is required'] });
  });
});
