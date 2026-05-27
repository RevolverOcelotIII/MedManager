import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeesPage from '@/src/app/employees/EmployeesPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';
import { useRouter } from 'next/navigation';

describe('EmployeesPage', () => {
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

  const MOCK_EMPLOYEES = [
    {
      id: 10,
      full_name: 'Employee One',
      cpf: '111.111.111-11',
      role: { name: 'Doctor' }
    },
    {
      id: 11,
      full_name: 'Employee Two',
      cpf: '222.222.222-22',
      role: { name: 'Nurse' }
    }
  ];

  const mockRouter = useRouter();

  describe('when accessed by an admin', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_ADMIN);
        if (url === '/employees/') return Promise.resolve(MOCK_EMPLOYEES);
        if (url === '/roles') return Promise.resolve([]);
        return Promise.reject(new Error('Not found'));
      });

      await act(async () => {
        render(<EmployeesPage />);
      });
    });

    it('should show the page title', async () => {
      expect(await screen.findByText(i18n.t('pages.employees.title'))).toBeInTheDocument();
    });

    it('should render the list of employees', async () => {
      expect(await screen.findByText('Employee One')).toBeInTheDocument();
      expect(await screen.findByText('Employee Two')).toBeInTheDocument();
    });

    describe('when searching for an employee', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText(i18n.t('common.search'));
        await user.type(searchInput, 'One');
      });

      it('should filter the list', () => {
        expect(screen.getByText('Employee One')).toBeInTheDocument();
        expect(screen.queryByText('Employee Two')).not.toBeInTheDocument();
      });
    });

    describe('when clicking the New button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const newButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(newButton);
      });

      it('should open the form modal with correct title', () => {
        expect(screen.getByText(i18n.t('pages.employees.new_title'))).toBeInTheDocument();
      });
    });

    describe('when clicking the Edit button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const editButtons = await screen.findAllByLabelText('Edit');
        await user.click(editButtons[0]);
      });

      it('should open the form modal with employee data', () => {
        expect(screen.getByText(i18n.t('pages.employees.edit_title'))).toBeInTheDocument();
        expect(screen.getByDisplayValue('Employee One')).toBeInTheDocument();
      });
    });

    describe('when clicking the View Details button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const viewButtons = await screen.findAllByLabelText('View Details');
        await user.click(viewButtons[0]);
      });

      it('should open the details modal', () => {
        expect(screen.getByText(i18n.t('pages.employees.details_title'))).toBeInTheDocument();
      });
    });

    describe('when deleting an employee', () => {
      beforeEach(async () => {
        window.confirm = jest.fn(() => true);
        const user = userEvent.setup();
        const deleteButtons = await screen.findAllByLabelText('Delete');
        await user.click(deleteButtons[0]);
      });

      it('should call the delete API', () => {
        expect(ApiService.delete).toHaveBeenCalledWith('/employees/10');
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
        render(<EmployeesPage />);
      });
    });

    it('should redirect to patients page', async () => {
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/patients');
      });
    });
  });
});
