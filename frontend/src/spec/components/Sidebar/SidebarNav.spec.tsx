import { render, screen, act } from '@testing-library/react';
import { SidebarNav } from '@/src/components/Sidebar/SidebarNav';
import { ApiService } from '@/src/services/api';
import { usePathname } from 'next/navigation';
import { i18n } from '@/src/lib/i18n';

describe('SidebarNav', () => {
  const MOCK_ADMIN_USER = {
    id: 1,
    email: 'admin@medmanager.com',
    employee: {
      id: 1,
      full_name: 'Admin User',
      role: {
        id: 1,
        name: 'Admin',
        access_level: 'admin'
      }
    }
  };

  const MOCK_DOCTOR_USER = {
    id: 2,
    email: 'doctor@medmanager.com',
    employee: {
      id: 2,
      full_name: 'Dr. Gregory House',
      role: {
        id: 2,
        name: 'Doctor',
        access_level: 'doctor'
      }
    }
  };

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/patients');
  });

  describe('when the user is an admin', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockResolvedValue(MOCK_ADMIN_USER);
      await act(async () => {
        render(<SidebarNav isCollapsed={false} />);
      });
    });

    it('should show the workspace section header', () => {
      expect(screen.getByText(i18n.t('sidebar.workspace'))).toBeInTheDocument();
    });

    it('should show the administration section header', () => {
      expect(screen.getByText(i18n.t('sidebar.administration'))).toBeInTheDocument();
    });

    it('should mark the Patients item as active', () => {
      const patientsLink = screen.getByRole('link', { name: i18n.t('sidebar.patients') });
      expect(patientsLink).toHaveClass('active');
    });

    it('should show the Users link in administration', () => {
      expect(screen.getByRole('link', { name: i18n.t('sidebar.users') })).toBeInTheDocument();
    });
  });

  describe('when the user is a doctor', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockResolvedValue(MOCK_DOCTOR_USER);
      await act(async () => {
        render(<SidebarNav isCollapsed={false} />);
      });
    });

    it('should show the workspace section header', () => {
      expect(screen.getByText(i18n.t('sidebar.workspace'))).toBeInTheDocument();
    });

    it('should NOT show the administration section header', () => {
      expect(screen.queryByText(i18n.t('sidebar.administration'))).not.toBeInTheDocument();
    });

    it('should NOT show the Users link', () => {
      expect(screen.queryByRole('link', { name: i18n.t('sidebar.users') })).not.toBeInTheDocument();
    });
  });

  describe('when the sidebar is collapsed', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockResolvedValue(MOCK_ADMIN_USER);
      await act(async () => {
        render(<SidebarNav isCollapsed={true} />);
      });
    });

    it('should hide the section labels', () => {
      expect(screen.queryByText(i18n.t('sidebar.workspace'))).not.toBeInTheDocument();
      expect(screen.queryByText(i18n.t('sidebar.administration'))).not.toBeInTheDocument();
    });

    it('should hide the item labels', () => {
      expect(screen.queryByText(i18n.t('sidebar.patients'))).not.toBeInTheDocument();
    });

    it('should have collapsed class on items', () => {
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveClass('collapsed');
    });
  });
});
