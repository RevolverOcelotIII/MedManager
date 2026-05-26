import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailsModal } from '@/src/components/layout/Modal/DetailsModal';
import { i18n } from '@/src/lib/i18n';

describe('DetailsModal', () => {
  interface MockData {
    name: string;
    status: string;
    empty: string | null;
  }

  const DATA: MockData = { name: 'Gregory House', status: 'active', empty: null };
  const COLUMNS = [
    { name: 'name', label: 'Full Name', details: true },
    { 
      name: 'status', 
      label: 'Current Status', 
      details: true, 
      badge: true, 
      options: [{ label: 'Active', value: 'active' }] 
    },
    { name: 'empty', label: 'Empty Field', details: true },
  ];
  const TITLE = 'Person Details';
  const onClose = jest.fn();

  describe('when it is open', () => {
    beforeEach(() => {
      render(
        <DetailsModal 
          isOpen={true} 
          onClose={onClose} 
          title={TITLE} 
          data={DATA} 
          columns={COLUMNS} 
        />
      );
    });

    it('should show the modal title', () => {
      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });

    it('should render the populated fields', () => {
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('Gregory House')).toBeInTheDocument();
    });

    it('should render badges for configured fields', () => {
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('badge');
    });

    it('should NOT render empty fields', () => {
      expect(screen.queryByText('Empty Field')).not.toBeInTheDocument();
    });

    describe('when the header close button is clicked', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const closeButtons = screen.getAllByRole('button', { name: i18n.t('common.close') });
        await user.click(closeButtons[0]);
      });

      it('should call the onClose callback', () => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    describe('when the footer close button is clicked', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const closeButtons = screen.getAllByRole('button', { name: i18n.t('common.close') });
        await user.click(closeButtons[1]);
      });

      it('should call the onClose callback', () => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('when it has custom content', () => {
    beforeEach(() => {
      render(
        <DetailsModal 
          isOpen={true} 
          onClose={onClose} 
          title={TITLE} 
          data={DATA} 
          columns={COLUMNS}
          customContent={<div data-testid="custom">Custom Module</div>}
        />
      );
    });

    it('should render the custom content', () => {
      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });
  });

  describe('when it has sections', () => {
    const SECTIONS = [
      { title: 'Identity', fields: ['name'] },
      { title: 'System', fields: ['status'] },
    ];

    beforeEach(() => {
      render(
        <DetailsModal 
          isOpen={true} 
          onClose={onClose} 
          title={TITLE} 
          data={DATA} 
          columns={COLUMNS}
          sections={SECTIONS}
        />
      );
    });

    it('should render the section titles', () => {
      expect(screen.getByText('Identity')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('should group fields under sections', () => {
      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('Current Status')).toBeInTheDocument();
    });
  });
});
