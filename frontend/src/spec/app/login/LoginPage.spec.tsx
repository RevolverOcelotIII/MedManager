import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/src/app/login/LoginPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

describe('LoginPage', () => {
  const mockRouter = useRouter();

  beforeEach(() => {
    jest.clearAllMocks();
    Cookies.remove('token');
  });

  describe('when it is rendered', () => {
    beforeEach(() => {
      render(<LoginPage />);
    });

    it('should show the welcome title', () => {
      expect(screen.getByText(i18n.t('pages.login.welcome'))).toBeInTheDocument();
    });

    it('should show the email and password inputs', () => {
      expect(screen.getByLabelText(i18n.t('pages.login.email'))).toBeInTheDocument();
      expect(screen.getByLabelText(i18n.t('pages.login.password'))).toBeInTheDocument();
    });

    describe('when filling the form and submitting successfully', () => {
      beforeEach(async () => {
        (ApiService.post as jest.Mock).mockResolvedValue({
          access_token: 'valid-token',
          token_type: 'bearer'
        });

        const user = userEvent.setup();
        await user.type(screen.getByLabelText(i18n.t('pages.login.email')), 'test@test.com');
        await user.type(screen.getByLabelText(i18n.t('pages.login.password')), 'password123');
        
        const form = screen.getByLabelText(i18n.t('pages.login.email')).closest('form');
        if (form) fireEvent.submit(form);
      });

      it('should call the login API', () => {
        expect(ApiService.post).toHaveBeenCalledWith('/auth/login', {
          username: 'test@test.com',
          password: 'password123'
        }, true);
      });

      it('should set the token cookie', () => {
        expect(Cookies.get('token')).toBe('valid-token');
      });

      it('should redirect to attendances page', () => {
        expect(mockRouter.push).toHaveBeenCalledWith('/attendances');
      });
    });

    describe('when login fails', () => {
      beforeEach(async () => {
        window.alert = jest.fn();
        (ApiService.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const user = userEvent.setup();
        await user.type(screen.getByLabelText(i18n.t('pages.login.email')), 'wrong@test.com');
        await user.type(screen.getByLabelText(i18n.t('pages.login.password')), 'wrongpass');
        
        const form = screen.getByLabelText(i18n.t('pages.login.email')).closest('form');
        if (form) fireEvent.submit(form);
      });

      it('should show an alert message', async () => {
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith(i18n.t('login.login_failed'));
        });
      });

      it('should NOT set the token cookie', () => {
        expect(Cookies.get('token')).toBeUndefined();
      });
    });
  });
});
