import { BcryptjsHashProvider } from '../../bcryptjs-hash.provider';

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider;

  beforeEach(() => {
    sut = new BcryptjsHashProvider();
  });
  it('Should return encrypted hashed password', async () => {
    const password = 'test@test123';
    const hash = await sut.generateHash(password);

    expect(hash).toBeDefined();
  });

  it('Should return false on invalid password and hash comparating', async () => {
    const password = 'test@test123';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash('invalidpassword', hash);

    expect(result).toBeFalsy();
  });

  it('Should return true on valid password and hash comparating', async () => {
    const password = 'test@test123';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash(password, hash);

    expect(result).toBeTruthy();
  });
});
