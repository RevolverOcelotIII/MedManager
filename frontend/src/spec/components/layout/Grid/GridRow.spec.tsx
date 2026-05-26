import { render, screen } from '@testing-library/react';
import { GridRow } from '@/src/components/layout/Grid/GridRow';
import { GridColumn } from '@/src/types';

describe('GridRow', () => {
  interface MockData {
    id: number;
    name: string;
    status: string;
  }

  const ITEM: MockData = { id: 1, name: 'Gregory House', status: 'active' };
  
  const COLUMNS: GridColumn<MockData>[] = [
    { header: 'Name', accessor: 'name' },
    { 
      header: 'Status', 
      accessor: 'status', 
      badge: true, 
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ] 
    },
  ];

  describe('when it is rendered', () => {
    beforeEach(() => {
      render(
        <table>
          <tbody>
            <GridRow item={ITEM} columns={COLUMNS} />
          </tbody>
        </table>
      );
    });

    it('should render the simple text value', () => {
      expect(screen.getByText('Gregory House')).toBeInTheDocument();
    });

    it('should render the badge with correct label', () => {
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should apply the correct color class to the badge', () => {
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('badge');
      expect(badge).toHaveClass('color-1');
    });
  });

  describe('when using a function as accessor', () => {
    const CUSTOM_COLUMNS: GridColumn<MockData>[] = [
      { header: 'Custom', accessor: (item) => `ID: ${item.id}` }
    ];

    beforeEach(() => {
      render(
        <table>
          <tbody>
            <GridRow item={ITEM} columns={CUSTOM_COLUMNS} />
          </tbody>
        </table>
      );
    });

    it('should render the result of the function', () => {
      expect(screen.getByText('ID: 1')).toBeInTheDocument();
    });
  });
});
