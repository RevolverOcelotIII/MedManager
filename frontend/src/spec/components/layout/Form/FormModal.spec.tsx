import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormModal } from '@/src/components/layout/Form/FormModal';
import { FormModalColumn } from '@/src/types/components/layout/Form/FormModal';
import { i18n } from '@/src/lib/i18n';

describe('FormModal', () => {
  const COLUMNS: FormModalColumn[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'role', label: 'Role', type: 'select', options: [{ label: 'Doctor', value: 'doc' }] },
  ];
  const TITLE = 'Create Entity';
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  describe('when it is open', () => {
    beforeEach(() => {
      render(
        <FormModal 
          isOpen={true} 
          onClose={onClose} 
          onSubmit={onSubmit} 
          title={TITLE} 
          columns={COLUMNS} 
        />
      );
    });

    it('should show the modal title', () => {
      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });

    it('should render all configured fields', () => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });

    describe('when the user fills the form and submits', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        await user.type(screen.getByRole('textbox'), 'Gregory');
        await user.click(screen.getByRole('button', { name: i18n.t('common.new') }));
      });

      it('should call onSubmit with the form data', () => {
        expect(onSubmit).toHaveBeenCalledWith({ name: 'Gregory' });
      });
    });

    describe('when the user clicks cancel', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: i18n.t('common.cancel') }));
      });

      it('should call the onClose callback', () => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('when it has initial data (Edit mode)', () => {
    const INITIAL_DATA = { id: 1, name: 'House' };

    beforeEach(() => {
      render(
        <FormModal 
          isOpen={true} 
          onClose={onClose} 
          onSubmit={onSubmit} 
          title="Edit" 
          columns={COLUMNS} 
          initialData={INITIAL_DATA}
        />
      );
    });

    it('should pre-fill the fields', () => {
      expect(screen.getByDisplayValue('House')).toBeInTheDocument();
    });

    it('should show the Save button instead of New', () => {
      expect(screen.getByRole('button', { name: i18n.t('common.save') })).toBeInTheDocument();
    });
  });

  describe('when a field changes', () => {
    const onChange = jest.fn();

    beforeEach(async () => {
      render(
        <FormModal 
          isOpen={true} 
          onClose={onClose} 
          onSubmit={onSubmit} 
          onChange={onChange}
          title={TITLE} 
          columns={COLUMNS} 
        />
      );
      const user = userEvent.setup();
      await user.type(screen.getByRole('textbox'), 'Wilson');
    });

    it('should call the onChange callback with updated data', () => {
      expect(onChange).toHaveBeenCalledWith({ name: 'Wilson' });
    });
  });
});
