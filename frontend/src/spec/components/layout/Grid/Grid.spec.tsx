import { render, screen } from '@testing-library/react';
import { Grid } from '@/src/components/layout/Grid/Grid';
import { i18n } from '@/src/lib/i18n';

describe('Grid', () => {
  const COLUMNS = [
    { header: 'Name', accessor: 'name' }
  ];
  const DATA = [{ id: 1, name: 'Item 1' }];

  describe('when it is loading', () => {
    beforeEach(() => {
      render(<Grid data={[]} columns={COLUMNS} rowKey="id" isLoading={true} />);
    });

    it('should show the loading state', () => {
      expect(screen.getByText(i18n.t('common.loading'))).toBeInTheDocument();
    });
  });

  describe('when it has no data', () => {
    beforeEach(() => {
      render(<Grid data={[]} columns={COLUMNS} rowKey="id" isLoading={false} />);
    });

    it('should show the no data message', () => {
      expect(screen.getByText(i18n.t('common.no_data'))).toBeInTheDocument();
    });
  });

  describe('when it has data', () => {
    beforeEach(() => {
      render(<Grid data={DATA} columns={COLUMNS} rowKey="id" isLoading={false} />);
    });

    it('should render the rows', () => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should NOT show the loading or no data messages', () => {
      expect(screen.queryByText(i18n.t('common.loading'))).not.toBeInTheDocument();
      expect(screen.queryByText(i18n.t('common.no_data'))).not.toBeInTheDocument();
    });
  });
});
