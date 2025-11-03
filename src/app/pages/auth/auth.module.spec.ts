import { AuthModule } from './auth.module';

describe('SessionsModule', () => {
  let authModule: AuthModule;

  beforeEach(() => {
    authModule = new AuthModule();
  });

  it('should create an instance', () => {
    expect(AuthModule).toBeTruthy();
  });
});
