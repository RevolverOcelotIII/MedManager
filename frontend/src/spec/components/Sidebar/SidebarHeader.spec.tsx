import { render, screen } from '@testing-library/react';
import { SidebarHeader } from '@/src/components/Sidebar/SidebarHeader';

describe('SidebarHeader', () => {
  describe('when it is rendered in expanded mode', () => {
    beforeEach(() => {
      render(<SidebarHeader isCollapsed={false} />);
    });

    it('should show the brand name', () => {
      expect(screen.getByText('MedManager')).toBeInTheDocument();
    });

    it('should show the brand subtitle', () => {
      expect(screen.getByText('Hospital Suite')).toBeInTheDocument();
    });
  });

  describe('when it is rendered in collapsed mode', () => {
    beforeEach(() => {
      render(<SidebarHeader isCollapsed={true} />);
    });

    it('should hide the brand name', () => {
      expect(screen.queryByText('MedManager')).not.toBeInTheDocument();
    });

    it('should hide the brand subtitle', () => {
      expect(screen.queryByText('Hospital Suite')).not.toBeInTheDocument();
    });
  });
});
