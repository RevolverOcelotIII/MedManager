import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AttendanceProceduresModule } from '@/src/app/attendances/AttendanceProceduresModule';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('AttendanceProceduresModule', () => {
  const ATTENDANCE_ID = 1;

  const MOCK_USER = {
    id: 1,
    employee_id: 1,
    employee: {
      id: 1,
      full_name: 'Dr. Gregory House',
      role: { id: 1, name: 'Doctor', access_level: 'doctor' }
    }
  };

  const MOCK_PROCEDURES = [
    { id: 1, name: 'X-Ray', code: 'X01' }
  ];

  const MOCK_EMPLOYEES = [
    { id: 1, full_name: 'Dr. Gregory House' }
  ];

  const MOCK_ATTENDANCE_PROCEDURES = [
    {
      id: 10,
      procedure_id: 1,
      procedure: { name: 'X-Ray' },
      status: 'pending',
      ordered_by: { full_name: 'Dr. House' },
      start_time: '2023-01-01T10:00:00',
      end_time: null,
      medications: []
    }
  ];

  beforeEach(async () => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      if (url === '/auth/me') return Promise.resolve(MOCK_USER);
      if (url.includes(`/attendance-procedures/attendance/${ATTENDANCE_ID}`)) return Promise.resolve(MOCK_ATTENDANCE_PROCEDURES);
      if (url === '/procedures/') return Promise.resolve(MOCK_PROCEDURES);
      if (url.includes('/employees/')) return Promise.resolve(MOCK_EMPLOYEES);
      if (url === '/medications/') return Promise.resolve([]);
      return Promise.reject(new Error(`Not found: ${url}`));
    });

    await act(async () => {
      render(<AttendanceProceduresModule attendanceId={ATTENDANCE_ID} />);
    });
  });

  it('should show the module title', () => {
    expect(screen.getByText(i18n.t('sidebar.procedures'))).toBeInTheDocument();
  });

  it('should render the existing procedures list', async () => {
    expect(await screen.findByText('X-Ray')).toBeInTheDocument();
  });

  describe('when clicking the New button', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      const newButton = screen.getByRole('button', { name: i18n.t('common.new') });
      await user.click(newButton);
    });

    it('should open the form modal', () => {
      expect(screen.getByText(i18n.t('pages.attendance_procedure.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form and submitting', () => {
      beforeEach(async () => {
        (ApiService.post as jest.Mock).mockResolvedValue({ id: 11 });
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.attendance_procedure.procedure')), 'X-Ray');
        await user.click(screen.getByText('X01 - X-Ray'));
        
        await user.selectOptions(screen.getByLabelText(i18n.t('models.attendance_procedure.status')), 'pending');
        
        const form = document.getElementById('form-modal');
        if (form) fireEvent.submit(form);
      });

      it('should call the create API', () => {
        expect(ApiService.post).toHaveBeenCalledWith('/attendance-procedures/', expect.objectContaining({
          procedure_id: 1,
          attendance_id: ATTENDANCE_ID
        }));
      });
    });
  });
});
