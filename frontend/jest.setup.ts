import '@testing-library/jest-dom';
import { i18n } from '@/src/lib/i18n';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/src/store/useAuthStore';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockPrefetch = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
  })),
}));

jest.mock('@/src/services/api', () => ({
  ApiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

beforeAll(() => {
  i18n.locale = 'en';
  Cookies.set('token', 'mock-token');
});

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ user: null, isLoading: false });
});

afterAll(() => {
  Cookies.remove('token');
});
