import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GridPageHeader } from '@/src/components/layout/GridPage/GridPageHeader';
import { i18n } from '@/src/lib/i18n';

describe('GridPageHeader', () => {
  const TITLE = 'Test Page';
  const DESCRIPTION = 'This is a description';
  
  describe('when it is rendered with title and description', () => {
    beforeEach(() => {
      render(<GridPageHeader title={TITLE} description={DESCRIPTION} />);
    });

    it('should show the title', () => {
      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });

    it('should show the description', () => {
      expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
    });
  });

  describe('when it has search enabled', () => {
    const onSearchChange = jest.fn();

    beforeEach(() => {
      render(<GridPageHeader title={TITLE} searchValue="" onSearchChange={onSearchChange} />);
    });

    it('should show the search input', () => {
      expect(screen.getByPlaceholderText(i18n.t('common.search'))).toBeInTheDocument();
    });

    describe('when the user types in the search input', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText(i18n.t('common.search')), 'query');
      });

      it('should call the onSearchChange callback', () => {
        expect(onSearchChange).toHaveBeenCalled();
      });
    });
  });

  describe('when it has a "New" action enabled', () => {
    const onNewClick = jest.fn();

    beforeEach(() => {
      render(<GridPageHeader title={TITLE} onNewClick={onNewClick} />);
    });

    it('should show the new button', () => {
      expect(screen.getByRole('button', { name: i18n.t('common.new') })).toBeInTheDocument();
    });

    describe('when the button is clicked', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: i18n.t('common.new') }));
      });

      it('should call the onNewClick callback', () => {
        expect(onNewClick).toHaveBeenCalled();
      });
    });
  });
});
