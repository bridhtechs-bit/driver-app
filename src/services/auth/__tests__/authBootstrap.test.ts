import { bootstrapAuth } from '../authBootstrap';
import { secureStoreHelper } from '@/services/storage/secureStore';

jest.mock('@/services/api/secureStore', () => ({
  secureStoreHelper: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    deleteItem: jest.fn(),
  },
}));

describe('authBootstrap', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns unauthenticated when no token', async () => {
    (secureStoreHelper.getItem as any).mockResolvedValue(null);

    const res = await bootstrapAuth();

    expect(res.authenticated).toBe(false);
    expect(res.token).toBeNull();
    expect(res.user).toBeNull();
  });

  it('returns authenticated when token present', async () => {
    (secureStoreHelper.getItem as any).mockImplementation((key: string) => {
      if (key === 'token') return Promise.resolve('abc123');
      return Promise.resolve(null);
    });

    const res = await bootstrapAuth();

    expect(res.authenticated).toBe(true);
    expect(res.token).toBe('abc123');
  });

  it('restores onboarding completion from storage', async () => {
    (secureStoreHelper.getItem as any).mockImplementation((key: string) => {
      if (key === 'token') return Promise.resolve('abc123');
      if (key === 'onBoardingCompleted') return Promise.resolve('true');
      return Promise.resolve(null);
    });

    const res = await bootstrapAuth();

    expect(res.onboardingCompleted).toBe(true);
  });
});
