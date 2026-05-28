import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleFormModal } from '@/src/app/roles/RoleFormModal';
import { i18n } from '@/src/lib/i18n';

describe('RoleFormModal', () => {
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when creating a new role', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <RoleFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
          />
        );
      });
    });

    it('should show the new role title', () => {
      expect(screen.getByText(i18n.t('pages.roles.new_title'))).toBeInTheDocument();
    });

    describe('when filling the form correctly and submitting', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const nameInput = screen.getByLabelText(i18n.t('models.role.name'));
        const accessLevelSelect = screen.getByLabelText(i18n.t('models.role.access_level'));
        
        await user.type(nameInput, 'Surgeon');
        await user.selectOptions(accessLevelSelect, 'doctor');
        
        const submitButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(submitButton);
      });

      it('should call onSubmit with the data', () => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          name: 'Surgeon',
          access_level: 'doctor'
        }));
      });
    });
  });

  describe('when editing an existing role', () => {
    const EXISTING_ROLE = {
      id: 1,
      name: 'Registered Nurse',
      access_level: 'nurse'
    };

    beforeEach(async () => {
      await act(async () => {
        render(
          <RoleFormModal 
            isOpen={true} 
            onClose={onClose} 
            onSubmit={onSubmit} 
            role={EXISTING_ROLE}
          />
        );
      });
    });

    it('should show the edit role title', () => {
      expect(screen.getByText(i18n.t('pages.roles.edit_title'))).toBeInTheDocument();
    });

    it('should pre-fill the name field', () => {
      expect(screen.getByDisplayValue('Registered Nurse')).toBeInTheDocument();
    });
  });
});
