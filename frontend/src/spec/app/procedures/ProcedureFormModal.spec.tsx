import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProcedureFormModal } from '@/src/app/procedures/ProcedureFormModal';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('ProcedureFormModal', () => {
  const MOCK_ROLES = [
    { id: 1, name: 'Doctor' },
    { id: 2, name: 'Nurse' }
  ];

  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      if (url === '/roles') return Promise.resolve(MOCK_ROLES);
      return Promise.resolve([]);
    });
  });

  describe('when creating a new procedure', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <ProcedureFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
          />
        );
      });
    });

    it('should show the new procedure title', () => {
      expect(screen.getByText(i18n.t('pages.procedures.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form correctly and submitting', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.procedure.name')), 'New Exam');
        await user.type(screen.getByLabelText(i18n.t('models.procedure.code')), '01.01');
        await user.selectOptions(screen.getByLabelText(i18n.t('models.procedure.category')), 'exam');
        
        const form = document.getElementById('form-modal');
        if (form) fireEvent.submit(form);
      });

      it('should call onSubmit with the data', () => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          name: 'New Exam',
          code: '01.01',
          category: 'exam'
        }));
      });
    });
  });

  describe('when editing an existing procedure', () => {
    const EXISTING_PROCEDURE = {
      id: 10,
      name: 'Existing Surgery',
      code: '99.99',
      category: 'surgery',
      dispatch_roles: [],
      execute_roles: []
    };

    beforeEach(async () => {
      await act(async () => {
        render(
          <ProcedureFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
            procedure={EXISTING_PROCEDURE}
          />
        );
      });
    });

    it('should show the edit procedure title', () => {
      expect(screen.getByText(i18n.t('pages.procedures.edit_title'))).toBeInTheDocument();
    });

    it('should pre-fill the name field', () => {
      expect(screen.getByDisplayValue('Existing Surgery')).toBeInTheDocument();
    });
  });
});
