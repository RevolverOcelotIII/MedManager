import { render, screen } from '@testing-library/react';
import { GridHeader } from '@/src/components/layout/Grid/GridHeader';
import { GridColumn } from '@/src/types';

describe('GridHeader', () => {
  const COLUMNS: GridColumn<any>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age', align: 'right' },
  ];

  describe('when it is rendered', () => {
    beforeEach(() => {
      render(
        <table>
          <GridHeader columns={COLUMNS} />
        </table>
      );
    });

    it('should render all headers', () => {
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('should apply the correct alignment class', () => {
      const ageHeader = screen.getByText('Age');
      expect(ageHeader).toHaveClass('th-right');
    });
  });
});
