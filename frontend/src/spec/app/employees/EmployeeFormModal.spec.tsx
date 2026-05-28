import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeFormModal } from '@/src/app/employees/EmployeeFormModal';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('EmployeeFormModal', () => {
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

  describe('when creating a new employee', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <EmployeeFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
          />
        );
      });
    });

    it('should show the new employee title', () => {
      expect(screen.getByText(i18n.t('pages.employees.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form correctly and submitting', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.employee.full_name')), 'Gregory House');
        await user.type(screen.getByLabelText(i18n.t('models.employee.cpf')), '111.111.111-11');
        await user.type(screen.getByLabelText(i18n.t('models.employee.birth_date')), '1959-06-11');
        await user.type(screen.getByLabelText(i18n.t('models.employee.hire_date')), '2020-01-01');
        
        await user.selectOptions(screen.getByLabelText(i18n.t('models.employee.role')), '1');
        
        await user.click(screen.getByRole('button', { name: i18n.t('common.new') }));
      });

      it('should call onSubmit with the data', () => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          full_name: 'Gregory House',
          cpf: '111.111.111-11'
        }));
      });
    });
  });

  describe('when editing an existing employee', () => {
    const EXISTING_EMPLOYEE = {
      id: 10,
      full_name: 'Lisa Cuddy',
      cpf: '222.222.222-22',
      birth_date: '1967-01-01',
      hire_date: '2015-01-01',
      role_id: 1
    };

    beforeEach(async () => {
      await act(async () => {
        render(
          <EmployeeFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
            employee={EXISTING_EMPLOYEE}
          />
        );
      });
    });

    it('should show the edit employee title', () => {
      expect(screen.getByText(i18n.t('pages.employees.edit_title'))).toBeInTheDocument();
    });

    it('should pre-fill the name field', () => {
      expect(screen.getByDisplayValue('Lisa Cuddy')).toBeInTheDocument();
    });
  });
});
