import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AttendanceFormModal } from '@/src/app/attendances/AttendanceFormModal';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('AttendanceFormModal', () => {
  const MOCK_PATIENTS = [
    { id: 1, full_name: 'Gregory House', cpf: '123' },
    { id: 2, full_name: 'James Wilson', cpf: '456' }
  ];

  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      if (url === '/patients/') return Promise.resolve(MOCK_PATIENTS);
      return Promise.resolve([]);
    });
  });

  describe('when creating a new attendance', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <AttendanceFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
          />
        );
      });
    });

    it('should show the new attendance title', () => {
      expect(screen.getByText(i18n.t('pages.attendances.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form correctly and submitting', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.attendance.patient')), '123');
        await user.click(screen.getByText('123 - Gregory House'));
        
        await user.selectOptions(screen.getByLabelText(i18n.t('models.attendance.gravity')), 'red');
        
        const submitButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(submitButton);
      });

      it('should call onSubmit with the data', () => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          patient_id: 1,
          gravity: 'red'
        }));
      });
    });
  });
});
