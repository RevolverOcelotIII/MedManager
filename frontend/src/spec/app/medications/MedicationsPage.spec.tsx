import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MedicationsPage from '@/src/app/medications/MedicationsPage';
import { ApiService } from '@/src/services/api';
import { i18n } from '@/src/lib/i18n';
import { useRouter } from 'next/navigation';

describe('MedicationsPage', () => {
  const MOCK_PHARMA = {
    id: 1,
    email: 'pharma@medmanager.com',
    employee: {
      id: 1,
      full_name: 'Pharma Joe',
      role: { access_level: 'pharmaceutical' }
    }
  };

  const MOCK_DOCTOR = {
    id: 2,
    email: 'doc@medmanager.com',
    employee: {
      id: 2,
      full_name: 'Dr. House',
      role: { access_level: 'doctor' }
    }
  };

  const MOCK_MEDICATIONS = [
    {
      id: 1,
      trade_name: 'Aspirin',
      active_ingredient: 'Acetylsalicylic acid'
    },
    {
      id: 2,
      trade_name: 'Tylenol',
      active_ingredient: 'Paracetamol'
    }
  ];

  const mockRouter = useRouter();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when accessed by a pharmacist', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_PHARMA);
        if (url === '/medications/') return Promise.resolve(MOCK_MEDICATIONS);
        return Promise.reject(new Error('Not found'));
      });

      await act(async () => {
        render(<MedicationsPage />);
      });
    });

    it('should show the page title', async () => {
      expect(await screen.findByText(i18n.t('pages.medications.title'))).toBeInTheDocument();
    });

    it('should render the list of medications', async () => {
      expect(await screen.findByText('Aspirin')).toBeInTheDocument();
      expect(await screen.findByText('Tylenol')).toBeInTheDocument();
    });

    describe('when searching for a medication', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText(i18n.t('common.search'));
        await user.type(searchInput, 'Aspirin');
      });

      it('should filter the list', () => {
        expect(screen.getByText('Aspirin')).toBeInTheDocument();
        expect(screen.queryByText('Tylenol')).not.toBeInTheDocument();
      });
    });

    describe('when clicking the New button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const newButton = screen.getByRole('button', { name: i18n.t('common.new') });
        await user.click(newButton);
      });

      it('should open the form modal with correct title', () => {
        expect(screen.getByText(i18n.t('pages.medications.new_title'))).toBeInTheDocument();
      });
    });

    describe('when clicking the Edit button', () => {
      beforeEach(async () => {
        const user = userEvent.setup();
        const editButtons = await screen.findAllByLabelText(i18n.t('common.edit'));
        await user.click(editButtons[0]);
      });

      it('should open the form modal with medication data', () => {
        expect(screen.getByText(i18n.t('pages.medications.edit_title'))).toBeInTheDocument();
        expect(screen.getByDisplayValue('Aspirin')).toBeInTheDocument();
      });
    });

    describe('when deleting a medication', () => {
      beforeEach(async () => {
        window.confirm = jest.fn(() => true);
        const user = userEvent.setup();
        const deleteButtons = await screen.findAllByLabelText(i18n.t('common.delete'));
        await user.click(deleteButtons[0]);
      });

      it('should call the delete API', () => {
        expect(ApiService.delete).toHaveBeenCalledWith('/medications/1');
      });
    });
  });

  describe('when accessed by a doctor (view-only)', () => {
    beforeEach(async () => {
      (ApiService.get as jest.Mock).mockImplementation((url) => {
        if (url === '/auth/me') return Promise.resolve(MOCK_DOCTOR);
        if (url === '/medications/') return Promise.resolve(MOCK_MEDICATIONS);
        return Promise.reject(new Error('Not found'));
      });

      await act(async () => {
        render(<MedicationsPage />);
      });
    });

    it('should NOT show the New button', () => {
      expect(screen.queryByRole('button', { name: i18n.t('common.new') })).not.toBeInTheDocument();
    });

    it('should NOT show Edit or Delete buttons', () => {
      expect(screen.queryByLabelText(i18n.t('common.edit'))).not.toBeInTheDocument();
      expect(screen.queryByLabelText(i18n.t('common.delete'))).not.toBeInTheDocument();
    });

    it('should show the View Details button', () => {
      expect(screen.getAllByLabelText(i18n.t('common.view_details'))[0]).toBeInTheDocument();
    });
  });
});
