import '@testing-library/jest-dom';
import { i18n } from '@/src/lib/i18n';
import Cookies from 'js-cookie';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
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
});

beforeEach(() => {
  jest.clearAllMocks();
  Cookies.set('token', 'mock-token');
});

afterAll(() => {
  Cookies.remove('token');
});
