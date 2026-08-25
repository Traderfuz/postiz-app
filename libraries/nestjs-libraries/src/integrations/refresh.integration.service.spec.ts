import { classifyRefreshFailure } from './refresh.integration.service';

describe('refresh failure classification', () => {
  it('does not flag or disconnect on transient refresh errors', () => {
    const provider = {
      handleErrors: () => undefined,
    };

    expect(classifyRefreshFailure(provider, new Error('provider timeout'))).toBe('other');
  });

  it('flags only provider-recognized invalid refresh tokens', () => {
    const provider = {
      handleErrors: (body: string) =>
        /invalid token/i.test(body)
          ? { type: 'refresh-token' as const, value: 'reconnect' }
          : undefined,
    };

    expect(classifyRefreshFailure(provider, new Error('invalid token'))).toBe('refresh-token');
    expect(classifyRefreshFailure(provider, new Error('rate limit'))).toBe('other');
  });
});
