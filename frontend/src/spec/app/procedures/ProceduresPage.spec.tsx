import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProceduresPage from '@/src/app/procedures/ProceduresPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';
import { useRouter } from 'next/navigation';

describe('ProceduresPage', () => {
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

  const MOCK_PROCEDURES = [
    {
      id: 1,
      name: 'Procedure One',
      code: 'P001',
      category: 'exam',
      dispatch_roles: [],
      execute_roles: []
    },
    {
      id: 2,
      name: 'Procedure Two',
      code: 'P002',
      category: 'surgery',
      dispatch_roles: [],
      execute_roles: []
    }
  ];

  const mockRouter = useRouter();

  describe('when accessed by an admin', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_ADMIN);
        if (url === '/procedures/') return Promise.resolve(MOCK_PROCEDURES);
        if (url === '/roles') return Promise.resolve([]);
        return Promise.reject(new Error('Not found'));
      });

      await act(async () => {
        render(<ProceduresPage />);
      });
    });

    it('should show the page title', async () => {
      expect(await screen.findByText(i18n.t('pages.procedures.title'))).toBeInTheDocument();
    });

    it('should render the list of procedures', async () => {
      expect(await screen.findByText('Procedure One')).toBeInTheDocument();
      expect(await screen.findByText('Procedure Two')).toBeInTheDocument();
    });

    describe('when searching for a procedure', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText(i18n.t('common.search'));
        await user.type(searchInput, 'One');
      });

      it('should filter the list', () => {
        expect(screen.getByText('Procedure One')).toBeInTheDocument();
        expect(screen.queryByText('Procedure Two')).not.toBeInTheDocument();
      });
    });

    describe('when clicking the New button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const newButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(newButton);
      });

      it('should open the form modal with correct title', () => {
        expect(screen.getByText(i18n.t('pages.procedures.new_title'))).toBeInTheDocument();
      });
    });

    describe('when clicking the Edit button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const editButtons = await screen.findAllByLabelText(i18n.t('common.edit'));
        await user.click(editButtons[0]);
      });

      it('should open the form modal with procedure data', () => {
        expect(screen.getByText(i18n.t('pages.procedures.edit_title'))).toBeInTheDocument();
        expect(screen.getByDisplayValue('Procedure One')).toBeInTheDocument();
      });
    });

    describe('when clicking the View Details button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const viewButtons = await screen.findAllByLabelText(i18n.t('common.view_details'));
        await user.click(viewButtons[0]);
      });

      it('should open the details modal', () => {
        expect(screen.getByText(i18n.t('pages.procedures.details_title'))).toBeInTheDocument();
      });
    });

    describe('when deleting a procedure', () => {
      beforeEach(async () => {
        window.confirm = jest.fn(() => true);
        const user = userEvent.setup();
        const deleteButtons = await screen.findAllByLabelText(i18n.t('common.delete'));
        await user.click(deleteButtons[0]);
      });

      it('should call the delete API', () => {
        expect(ApiService.delete).toHaveBeenCalledWith('/procedures/1');
      });
    });
  });

  describe('when accessed by a non-admin', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_DOCTOR);
        return Promise.resolve([]);
      });

      await act(async () => {
        render(<ProceduresPage />);
      });
    });

    it('should redirect to patients page', async () => {
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/patients');
      });
    });
  });
});
