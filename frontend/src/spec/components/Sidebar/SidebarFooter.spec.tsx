import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidebarFooter } from '@/src/components/Sidebar/SidebarFooter';
import { ApiService } from '@/src/services/api';
import Cookies from 'js-cookie';

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

  describe('when it is loading', () => {
    beforeEach(() => {
      (ApiService.get as jest.Mock).mockReturnValue(new Promise(() => {}));
      render(<SidebarFooter isCollapsed={false} />);
    });

    it('should show the loading message', () => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('when there is no user', () => {
    let container: HTMLElement;

    beforeEach(async () => {
      Cookies.remove('token');
      (ApiService.get as jest.Mock).mockResolvedValue(null);
      
      const rendered = render(<SidebarFooter isCollapsed={false} />);
      container = rendered.container;
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should render nothing', () => {
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when a user is logged in', () => {
    beforeEach(() => {
      Cookies.set('token', 'mock-token');
      (ApiService.get as jest.Mock).mockResolvedValue(MOCK_USER);
    });

    describe('when the sidebar is expanded', () => {
      beforeEach(() => {
        render(<SidebarFooter isCollapsed={false} />);
      });

      it('should show the user name', async () => {
        expect(await screen.findByText(MOCK_USER_NAME)).toBeInTheDocument();
      });

      it('should show the user email', async () => {
        expect(await screen.findByText(MOCK_USER_EMAIL)).toBeInTheDocument();
      });

      describe('when the logout button is clicked', () => {
        beforeEach(async () => {
          const user = userEvent.setup();
          const logoutButton = await screen.findByRole('button', { name: 'Logout' });
          await user.click(logoutButton);
        });

        it('should remove the token cookie', () => {
          expect(Cookies.get('token')).toBeUndefined();
        });
      });
    });
  });
});
