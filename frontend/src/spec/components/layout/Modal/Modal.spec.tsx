import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/src/components/layout/Modal/Modal';
import { i18n } from '@/src/lib/i18n';

describe('Modal', () => {
  const TITLE = 'Test Modal';
  const onClose = jest.fn();

  describe('when it is closed', () => {
    let container: HTMLElement;

    beforeEach(() => {
      const rendered = render(
        <Modal isOpen={false} onClose={onClose} title={TITLE}>
          <div>Content</div>
        </Modal>
      );
      container = rendered.container;
    });

    it('should render nothing', () => {
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when it is open', () => {
    beforeEach(() => {
      render(
        <Modal isOpen={true} onClose={onClose} title={TITLE}>
          <div data-testid="content">Content</div>
        </Modal>
      );
    });

    it('should show the title', () => {
      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });

    it('should render the children', () => {
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    describe('when the close button is clicked', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        await user.click(screen.getByLabelText(i18n.t('common.close')));
      });

      it('should call the onClose callback', () => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    describe('when the overlay is clicked', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const overlay = screen.getByText(TITLE).closest('.modal-overlay');
        if (overlay) await user.click(overlay);
      });

      it('should call the onClose callback', () => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('when it has a footer', () => {
    beforeEach(() => {
      render(
        <Modal isOpen={true} onClose={onClose} title={TITLE} footer={<button>Footer Button</button>}>
          <div>Content</div>
        </Modal>
      );
    });

    it('should render the footer content', () => {
      expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument();
    });
  });
});
