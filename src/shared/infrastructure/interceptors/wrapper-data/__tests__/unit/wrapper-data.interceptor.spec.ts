/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { of } from 'rxjs';
import { WrapperDataInterceptor } from '../../wrapper-data.interceptor';

describe('WrapperDataInterceptor unit tests', () => {
  let interceptor: WrapperDataInterceptor;
  let props: any;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
    props = {
      name: 'Test name',
      email: 'test@email.com',
      password: 'test@password',
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrapper with data key', () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(props),
    });

    obs$.subscribe({
      next: value => {
        expect(value).toEqual({ data: props });
      },
    });
    expect(interceptor).toBeDefined();
  });

  it('should not wrapper when meta key is exists', () => {
    const result = { data: [props], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    obs$.subscribe({
      next: value => {
        expect(value).toEqual(result);
      },
    });
    expect(interceptor).toBeDefined();
  });
});
