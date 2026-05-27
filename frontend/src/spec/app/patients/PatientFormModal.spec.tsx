import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientFormModal } from '@/src/app/patients/PatientFormModal';
import { i18n } from '@/src/lib/i18n';

describe('PatientFormModal', () => {
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when creating a new patient', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <PatientFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
          />
        );
      });
    });

    it('should show the new patient title', () => {
      expect(screen.getByText(i18n.t('pages.patients.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form correctly and submitting', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.patient.full_name')), 'Patient X');
        await user.type(screen.getByLabelText(i18n.t('models.patient.cpf')), '000.000.000-00');
        await user.type(screen.getByLabelText(i18n.t('models.patient.birth_date')), '1990-01-01');
        
        const submitButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(submitButton);
      });

      it('should call onSubmit with the data', () => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          full_name: 'Patient X',
          cpf: '000.000.000-00'
        }));
      });
    });
  });

  describe('when editing an existing patient', () => {
    const EXISTING_PATIENT = {
      id: 10,
      full_name: 'John Doe',
      cpf: '999.999.999-99',
      birth_date: '1985-05-05'
    };

    beforeEach(async () => {
      await act(async () => {
        render(
          <PatientFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
            patient={EXISTING_PATIENT}
          />
        );
      });
    });

    it('should show the edit patient title', () => {
      expect(screen.getByText(i18n.t('pages.patients.edit_title'))).toBeInTheDocument();
    });

    it('should pre-fill the name field', () => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });
});
