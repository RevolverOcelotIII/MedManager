import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '@/src/components/Sidebar/Sidebar';
import { ApiService } from '@/src/services/api';

describe('Sidebar', () => {
  const COLLAPSE_LABEL = 'Collapse Sidebar';
  const EXPAND_LABEL = 'Expand Sidebar';

  beforeEach(async () => {
    (ApiService.get as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'user@medmanager.com',
      employee: {
        id: 1,
        full_name: 'Regular User',
        role: { access_level: 'attendant' }
      }
    });

    document.documentElement.style.removeProperty('--current-sidebar-width');
    
    await act(async () => {
      render(<Sidebar />);
    });
  });

  describe('when it is rendered', () => {
    it('should show the collapse toggle', () => {
      expect(screen.getByLabelText(COLLAPSE_LABEL)).toBeInTheDocument();
    });

    it('should set the default sidebar width variable', () => {
      expect(document.documentElement.style.getPropertyValue('--current-sidebar-width'))
        .toBe('var(--sidebar-width)');
    });

    it('should render the real child components (Header, Nav, Footer)', () => {
      expect(screen.getByText('MedManager')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    describe('when the toggle button is clicked', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        await act(async () => {
          await user.click(screen.getByLabelText(COLLAPSE_LABEL));
        });
      });

      it('should add the collapsed class to the aside element', () => {
        expect(screen.getByRole('complementary')).toHaveClass('collapsed');
      });

      it('should update the sidebar width variable to collapsed', () => {
        expect(document.documentElement.style.getPropertyValue('--current-sidebar-width'))
          .toBe('var(--sidebar-collapsed-width)');
      });

      it('should change the toggle aria-label to Expand', () => {
        expect(screen.getByLabelText(EXPAND_LABEL)).toBeInTheDocument();
      });

      it('should hide label text in children (integration verification)', () => {
        expect(screen.queryByText('MedManager')).not.toBeInTheDocument();
      });
    });
  });
});
