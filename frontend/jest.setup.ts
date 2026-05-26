import '@testing-library/jest-dom';
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

beforeEach(() => {
  Cookies.set('token', 'mock-token');
});

afterEach(() => {
  Cookies.remove('token');
});
