import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MedicationFormModal } from '@/src/app/medications/MedicationFormModal';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('MedicationFormModal', () => {
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when creating a new medication', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <MedicationFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
          />
        );
      });
    });

    it('should show the new medication title', () => {
      expect(screen.getByText(i18n.t('pages.medications.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form correctly and submitting', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.medication.trade_name')), 'Advil');
        await user.type(screen.getByLabelText(i18n.t('models.medication.active_ingredient')), 'Ibuprofen');
        await user.type(screen.getByLabelText(i18n.t('models.medication.dosage')), '200mg');
        await user.type(screen.getByLabelText(i18n.t('models.medication.unit')), 'Tablet');
        
        const form = document.getElementById('form-modal');
        if (form) fireEvent.submit(form);
      });

      it('should call onSubmit with the data', () => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          trade_name: 'Advil',
          active_ingredient: 'Ibuprofen',
          dosage: '200mg',
          unit: 'Tablet'
        }));
      });
    });
  });

  describe('when editing an existing medication', () => {
    const EXISTING_MEDICATION = {
      id: 1,
      trade_name: 'Paracetamol Trade',
      active_ingredient: 'Paracetamol Active',
      dosage: '500mg',
      unit: 'Tablet'
    };

    beforeEach(async () => {
      await act(async () => {
        render(
          <MedicationFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
            medication={EXISTING_MEDICATION}
          />
        );
      });
    });

    it('should show the edit medication title', () => {
      expect(screen.getByText(i18n.t('pages.medications.edit_title'))).toBeInTheDocument();
    });

    it('should pre-fill the trade name field', () => {
      expect(screen.getByLabelText(i18n.t('models.medication.trade_name'))).toHaveValue('Paracetamol Trade');
    });

    it('should pre-fill the active ingredient field', () => {
      expect(screen.getByLabelText(i18n.t('models.medication.active_ingredient'))).toHaveValue('Paracetamol Active');
    });
  });
});
