import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserFormModal } from '@/src/app/users/UserFormModal';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';

describe('UserFormModal', () => {
  const MOCK_EMPLOYEES = [
    { id: 1, full_name: 'Gregory House', cpf: '123' },
    { id: 2, full_name: 'James Wilson', cpf: '456' }
  ];

  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      if (url.includes('/employees/')) return Promise.resolve(MOCK_EMPLOYEES);
      return Promise.resolve([]);
    });
  });

  describe('when creating a new user', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <UserFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
          />
        );
      });
    });

    it('should show the new user title', () => {
      expect(screen.getByText(i18n.t('pages.users.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form correctly and submitting', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.user.email')), 'test@test.com');
        await user.type(screen.getByLabelText(i18n.t('models.user.password')), 'password123');
        await user.type(screen.getByLabelText(i18n.t('models.user.confirm_password')), 'password123');
        
        const form = document.getElementById('form-modal');
        if (form) fireEvent.submit(form);
      });

      it('should call onSubmit with the data', () => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          email: 'test@test.com',
          password: 'password123'
        }));
      });
    });

    describe('when passwords do not match', () => {
      beforeEach(async () => {
        window.alert = jest.fn();
        const user = userEvent.setup();
        
        await user.type(screen.getByLabelText(i18n.t('models.user.password')), 'pass1');
        await user.type(screen.getByLabelText(i18n.t('models.user.confirm_password')), 'pass2');
        
        const form = document.getElementById('form-modal');
        if (form) fireEvent.submit(form);
      });

      it('should show an alert and NOT call onSubmit', async () => {
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith(i18n.t('models.user.passwords_mismatch'));
        });
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('when editing an existing user', () => {
    const EXISTING_USER = {
      id: 10,
      email: 'house@princeton.com',
      employee_id: 1,
      employee: MOCK_EMPLOYEES[0]
    };

    beforeEach(async () => {
      await act(async () => {
        render(
          <UserFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
            user={EXISTING_USER}
          />
        );
      });
    });

    it('should show the edit user title', () => {
      expect(screen.getByText(i18n.t('pages.users.edit_title'))).toBeInTheDocument();
    });

    it('should pre-fill the email field', () => {
      expect(screen.getByDisplayValue('house@princeton.com')).toBeInTheDocument();
    });

    it('should show the keep current password placeholder', () => {
      expect(screen.getAllByPlaceholderText(i18n.t('models.user.keep_current')).length).toBeGreaterThan(0);
    });
  });
});
