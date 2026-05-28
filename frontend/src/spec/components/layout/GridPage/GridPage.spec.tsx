import { render, screen } from '@testing-library/react';
import { GridPage } from '@/src/components/layout/GridPage/GridPage';
import { GridColumn } from '@/src/types';

describe('GridPage', () => {
  const TITLE = 'Patients';
  const DESCRIPTION = 'List of hospital patients';
  const COLUMNS: GridColumn<any>[] = [
    { header: 'Name', accessor: 'name' }
  ];
  const DATA = [
    { id: 1, name: 'Gregory House' }
  ];

  describe('when it is rendered', () => {
    beforeEach(() => {
      render(
        <GridPage 
          title={TITLE} 
          description={DESCRIPTION} 
          columns={COLUMNS} 
          data={DATA} 
          rowKey="id" 
        />
      );
    });

    it('should show the page header title', () => {
      expect(screen.getByText(TITLE)).toBeInTheDocument();
    });

    it('should show the page header description', () => {
      expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
    });

    it('should render the grid with data', () => {
      expect(screen.getByText('Gregory House')).toBeInTheDocument();
    });

    it('should show the default breadcrumb in the layout header', () => {
      expect(screen.getByText('Hospital Suite')).toBeInTheDocument();
    });
  });

  describe('when a custom breadcrumb is provided', () => {
    const CUSTOM_BREADCRUMB = 'Admin > Users';

    beforeEach(() => {
      render(
        <GridPage 
          title={TITLE} 
          columns={COLUMNS} 
          data={DATA} 
          rowKey="id" 
          breadcrumb={CUSTOM_BREADCRUMB}
        />
      );
    });

    it('should show the custom breadcrumb', () => {
      expect(screen.getByText(CUSTOM_BREADCRUMB)).toBeInTheDocument();
    });
  });
});
