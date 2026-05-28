import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RolesPage from '@/src/app/roles/RolesPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';

describe('RolesPage', () => {
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

  const MOCK_ROLES = [
    {
      id: 1,
      name: 'Physician',
      access_level: 'doctor'
    },
    {
      id: 2,
      name: 'Technician',
      access_level: 'nurse'
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
        if (url === '/roles/') return Promise.resolve(MOCK_ROLES);
        return Promise.reject(new Error('Not found'));
      });

      await act(async () => {
        render(<RolesPage />);
      });
    });

    it('should show the page title', async () => {
      expect(await screen.findByText(i18n.t('pages.roles.title'))).toBeInTheDocument();
    });

    it('should render the list of roles', async () => {
      expect(await screen.findByText('Physician')).toBeInTheDocument();
      expect(await screen.findByText('Technician')).toBeInTheDocument();
    });

    describe('when searching for a role', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText(i18n.t('common.search'));
        await user.type(searchInput, 'Physician');
      });

      it('should filter the list', () => {
        expect(screen.getByText('Physician')).toBeInTheDocument();
        expect(screen.queryByText('Technician')).not.toBeInTheDocument();
      });
    });

    describe('when clicking the New button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const newButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(newButton);
      });

      it('should open the form modal with correct title', () => {
        expect(screen.getByText(i18n.t('pages.roles.new_title'))).toBeInTheDocument();
      });
    });

    describe('when clicking the Edit button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const editButtons = await screen.findAllByLabelText(i18n.t('common.edit'));
        await user.click(editButtons[0]);
      });

      it('should open the form modal with role data', () => {
        expect(screen.getByText(i18n.t('pages.roles.edit_title'))).toBeInTheDocument();
        expect(screen.getByDisplayValue('Physician')).toBeInTheDocument();
      });
    });

    describe('when deleting a role', () => {
      beforeEach(async () => {
        window.confirm = jest.fn(() => true);
        const user = userEvent.setup();
        const deleteButtons = await screen.findAllByLabelText(i18n.t('common.delete'));
        await user.click(deleteButtons[0]);
      });

      it('should call the delete API', () => {
        expect(ApiService.delete).toHaveBeenCalledWith('/roles/1');
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
        render(<RolesPage />);
      });
    });

    it('should redirect to attendances page', async () => {
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/attendances');
      });
    });
  });
});
