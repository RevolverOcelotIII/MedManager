import { render, screen } from '@testing-library/react';
import { SidebarItem } from '@/src/components/Sidebar/SidebarItem';

describe('SidebarItem', () => {
  const MOCK_LABEL = 'Dashboard';
  const MOCK_HREF = '/dashboard';
  const MockIcon = ({ className }: any) => <svg className={className} data-testid="mock-icon" />;

  const defaultProps = {
    href: MOCK_HREF,
    label: MOCK_LABEL,
    Icon: MockIcon,
    isActive: false,
    isCollapsed: false,
  };

  describe('when it is rendered in expanded mode', () => {
    beforeEach(() => {
      render(<SidebarItem {...defaultProps} />);
    });

    it('should show the label text', () => {
      expect(screen.getByText(MOCK_LABEL)).toBeInTheDocument();
    });

    it('should NOT have a title attribute on the link', () => {
      expect(screen.getByRole('link')).not.toHaveAttribute('title');
    });

    it('should NOT have the collapsed class', () => {
      expect(screen.getByRole('link')).not.toHaveClass('collapsed');
    });
  });

  describe('when it is active', () => {
    it('should have the active class', () => {
      render(<SidebarItem {...defaultProps} isActive={true} />);
      expect(screen.getByRole('link')).toHaveClass('active');
    });
  });

  describe('when it is rendered in collapsed mode', () => {
    beforeEach(() => {
      render(<SidebarItem {...defaultProps} isCollapsed={true} />);
    });

    it('should hide the label text', () => {
      expect(screen.queryByText(MOCK_LABEL)).not.toBeInTheDocument();
    });

    it('should have the label as a title attribute for tooltip', () => {
      expect(screen.getByRole('link')).toHaveAttribute('title', MOCK_LABEL);
    });

    it('should have the collapsed class', () => {
      expect(screen.getByRole('link')).toHaveClass('collapsed');
    });
  });
});
