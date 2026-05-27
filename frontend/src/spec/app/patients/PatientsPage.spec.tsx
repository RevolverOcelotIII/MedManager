import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatientsPage from '@/src/app/patients/PatientsPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('PatientsPage', () => {
  const MOCK_ATTENDANT = {
    id: 1,
    email: 'attendant@medmanager.com',
    employee: {
      id: 1,
      full_name: 'Attendant Joe',
      role: { access_level: 'attendant' }
    }
  };

  const MOCK_PATIENTS = [
    {
      id: 10,
      full_name: 'Patient One',
      cpf: '111.111.111-11'
    },
    {
      id: 11,
      full_name: 'Patient Two',
      cpf: '222.222.222-22'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when accessed by an attendant', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_ATTENDANT);
        if (url === '/patients/') return Promise.resolve(MOCK_PATIENTS);
        return Promise.reject(new Error('Not found'));
      });

      await act(async () => {
        render(<PatientsPage />);
      });
    });

    it('should show the page title', async () => {
      expect(await screen.findByText(i18n.t('pages.patients.title'))).toBeInTheDocument();
    });

    it('should render the list of patients', async () => {
      expect(await screen.findByText('Patient One')).toBeInTheDocument();
      expect(await screen.findByText('Patient Two')).toBeInTheDocument();
    });

    describe('when searching for a patient', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText(i18n.t('common.search'));
        await user.type(searchInput, 'One');
      });

      it('should filter the list', () => {
        expect(screen.getByText('Patient One')).toBeInTheDocument();
        expect(screen.queryByText('Patient Two')).not.toBeInTheDocument();
      });
    });

    describe('when clicking the New button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const newButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(newButton);
      });

      it('should open the form modal with correct title', () => {
        expect(screen.getByText(i18n.t('pages.patients.new_title'))).toBeInTheDocument();
      });
    });

    describe('when clicking the Edit button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const editButtons = await screen.findAllByLabelText('Edit');
        await user.click(editButtons[0]);
      });

      it('should open the form modal with patient data', () => {
        expect(screen.getByText(i18n.t('pages.patients.edit_title'))).toBeInTheDocument();
        expect(screen.getByDisplayValue('Patient One')).toBeInTheDocument();
      });
    });

    describe('when clicking the View Details button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const viewButtons = await screen.findAllByLabelText('View Details');
        await user.click(viewButtons[0]);
      });

      it('should open the details modal', () => {
        expect(screen.getByText(i18n.t('pages.patients.details_title'))).toBeInTheDocument();
      });
    });
  });
});
