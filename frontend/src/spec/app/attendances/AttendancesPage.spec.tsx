import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AttendancesPage from '@/src/app/attendances/AttendancesPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('AttendancesPage', () => {
  const MOCK_USER = {
    id: 1,
    employee_id: 1,
    employee: {
      id: 1,
      full_name: 'Dr. Gregory House',
      role: { access_level: 'doctor' }
    }
  };

  const MOCK_ATTENDANCES = [
    {
      id: 1,
      patient_id: 10,
      patient: { full_name: 'Patient One', cpf: '123' },
      gravity: 'red',
      status: 'active',
      created_at: '2023-01-01T10:00:00',
      procedures: []
    },
    {
      id: 2,
      patient_id: 11,
      patient: { full_name: 'Patient Two', cpf: '456' },
      gravity: 'green',
      status: 'active',
      created_at: '2023-01-01T11:00:00',
      procedures: []
    }
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      if (url === '/auth/me') return Promise.resolve(MOCK_USER);
      if (url === '/attendances/') return Promise.resolve(MOCK_ATTENDANCES);
      if (url === '/patients/') return Promise.resolve([]);
      if (url === '/procedures/') return Promise.resolve([]);
      if (url === '/medications/') return Promise.resolve([]);
      if (url.includes('/attendance-procedures/')) return Promise.resolve([]);
      if (url.includes('/employees/')) return Promise.resolve([]);
      return Promise.reject(new Error(`Not found: ${url}`));
    });

    await act(async () => {
      render(<AttendancesPage />);
    });
  });

  it('should show the page title', async () => {
    expect(await screen.findByText(i18n.t('pages.attendances.title'))).toBeInTheDocument();
  });

  it('should render the list of attendances', async () => {
    expect(await screen.findByText('Patient One')).toBeInTheDocument();
    expect(await screen.findByText('Patient Two')).toBeInTheDocument();
  });

  describe('when searching for an attendance', () => {
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

  describe('when clicking the View Details button', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      const viewButtons = await screen.findAllByLabelText(i18n.t('common.view_details'));
      await user.click(viewButtons[0]);
    });

    it('should open the details modal', async () => {
      expect(await screen.findByText(i18n.t('pages.attendances.details_title'))).toBeInTheDocument();
    });

    it('should show the AttendanceProceduresModule inside details', async () => {
      expect(await screen.findByText(i18n.t('sidebar.procedures'))).toBeInTheDocument();
    });
  });
});
