import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from '@/src/app/users/UsersPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';

describe('UsersPage', () => {
  const MOCK_ADMIN = {
    id: 1,
    email: 'admin@medmanager.com',
    employee: {
      id: 1,
      full_name: 'Admin Boss',
      role: { access_level: 'admin' }
    }
  };

  const MOCK_DOCTOR = {
    id: 2,
    email: 'doc@medmanager.com',
    employee: {
      id: 2,
      full_name: 'Dr. House',
      role: { access_level: 'doctor' }
    }
  };

  const MOCK_USERS = [
    {
      id: 10,
      email: 'user1@test.com',
      employee: { full_name: 'User One' }
    },
    {
      id: 11,
      email: 'user2@test.com',
      employee: { full_name: 'User Two' }
    }
  ];

  const mockRouter = useRouter();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when accessed by an admin', () => {
    beforeEach(async () => {
      useAuthStore.setState({ user: MOCK_ADMIN as any, isLoading: false });
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_ADMIN);
        if (url === '/users/') return Promise.resolve(MOCK_USERS);
        if (url.includes('/employees/')) return Promise.resolve([]);
        return Promise.reject(new Error('Not found'));
      });

      await act(async () => {
        render(<UsersPage />);
      });
    });

    it('should show the page title', async () => {
      expect(await screen.findByText(i18n.t('pages.users.title'))).toBeInTheDocument();
    });

    it('should render the list of users', async () => {
      expect(await screen.findByText('user1@test.com')).toBeInTheDocument();
      expect(await screen.findByText('user2@test.com')).toBeInTheDocument();
    });

    describe('when searching for a user', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText(i18n.t('common.search'));
        await user.type(searchInput, 'One');
      });

      it('should filter the list', () => {
        expect(screen.getByText('user1@test.com')).toBeInTheDocument();
        expect(screen.queryByText('user2@test.com')).not.toBeInTheDocument();
      });
    });

    describe('when clicking the New button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const newButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(newButton);
      });

      it('should open the form modal with correct title', () => {
        expect(screen.getByText(i18n.t('pages.users.new_title'))).toBeInTheDocument();
      });
    });

    describe('when clicking the Edit button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const editButtons = await screen.findAllByLabelText('Edit');
        await user.click(editButtons[0]);
      });

      it('should open the form modal with user data', () => {
        expect(screen.getByText(i18n.t('pages.users.edit_title'))).toBeInTheDocument();
        expect(screen.getByDisplayValue('user1@test.com')).toBeInTheDocument();
      });
    });

    describe('when deleting a user', () => {
      beforeEach(async () => {
        window.confirm = jest.fn(() => true);
        const user = userEvent.setup();
        const deleteButtons = await screen.findAllByLabelText('Delete');
        await user.click(deleteButtons[0]);
      });

      it('should call the delete API', () => {
        expect(ApiService.delete).toHaveBeenCalledWith('/users/10');
      });
    });
  });

  describe('when accessed by a non-admin', () => {
    beforeEach(async () => {
      useAuthStore.setState({ user: MOCK_DOCTOR as any, isLoading: false });
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_DOCTOR);
        return Promise.resolve([]);
      });

      await act(async () => {
        render(<UsersPage />);
      });
    });

    it('should redirect to attendances page', async () => {
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/attendances');
      });
    });
  });
});
