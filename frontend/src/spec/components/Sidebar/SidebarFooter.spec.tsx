import { render, screen, act, waitFor } from '@testing-library/react';
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
    it('should show the loading message', async () => {
      (ApiService.get as jest.Mock).mockReturnValue(new Promise(() => {}));
      render(<SidebarFooter isCollapsed={false} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('when there is no user', () => {
    it('should render nothing', async () => {
      Cookies.remove('token');
      (ApiService.get as jest.Mock).mockResolvedValue(null);
      
      const { container } = render(<SidebarFooter isCollapsed={false} />);
      
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when a user is logged in', () => {
    beforeEach(() => {
      Cookies.set('token', 'mock-token');
      (ApiService.get as jest.Mock).mockResolvedValue(MOCK_USER);
    });

    it('should show the user name', async () => {
      render(<SidebarFooter isCollapsed={false} />);
      expect(await screen.findByText(MOCK_USER_NAME)).toBeInTheDocument();
    });

    it('should show the user email', async () => {
      render(<SidebarFooter isCollapsed={false} />);
      expect(await screen.findByText(MOCK_USER_EMAIL)).toBeInTheDocument();
    });

    it('should remove the token cookie when logout is clicked', async () => {
      const user = userEvent.setup();
      render(<SidebarFooter isCollapsed={false} />);
      
      const logoutButton = await screen.findByRole('button', { name: 'Logout' });
      await user.click(logoutButton);
      
      expect(Cookies.get('token')).toBeUndefined();
    });
  });
});
