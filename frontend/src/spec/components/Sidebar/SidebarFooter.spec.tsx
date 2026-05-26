import { render, screen, fireEvent, act } from '@testing-library/react';
import { SidebarFooter } from '@/src/components/Sidebar/SidebarFooter';
import { ApiService } from '@/src/services/api';
import Cookies from 'js-cookie';
import { i18n } from '@/src/lib/i18n';

describe('SidebarFooter', () => {
  const MOCK_USER_NAME = 'Gregory House';
  const MOCK_USER_EMAIL = 'house@princeton.com';
  const MOCK_USER = {
    id: 1,
    email: MOCK_USER_EMAIL,
    employee: { 
      id: 1,
      full_name: MOCK_USER_NAME,
      role: {
        id: 1,
        name: 'Doctor',
        access_level: 'doctor'
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    i18n.locale = 'en';
  });

  describe('when it is loading', () => {
    beforeEach(() => {
      (ApiService.get as jest.Mock).mockReturnValue(new Promise(() => {}));
      render(<SidebarFooter isCollapsed={false} />);
    });

    it('should show the loading message', () => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('when there is no user (token removed)', () => {
    beforeEach(async () => {
      Cookies.remove('token');
      (ApiService.get as jest.Mock).mockResolvedValue(null);
      await act(async () => {
        render(<SidebarFooter isCollapsed={false} />);
      });
    });

    it('should render nothing', () => {
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
    });
  });

  describe('when a user is logged in', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockResolvedValue(MOCK_USER);
      await act(async () => {
        render(<SidebarFooter isCollapsed={false} />);
      });
    });

    describe('and the sidebar is expanded', () => {
      it('should show the user name', () => {
        expect(screen.getByText(MOCK_USER_NAME)).toBeInTheDocument();
      });

      it('should show the user email', () => {
        expect(screen.getByText(MOCK_USER_EMAIL)).toBeInTheDocument();
      });
    });

    describe('when the logout button is clicked', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
      });

      it('should remove the token cookie', () => {
        expect(Cookies.get('token')).toBeUndefined();
      });
    });
  });
});
