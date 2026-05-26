import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from '@/src/components/layout/Form/SearchInput';

describe('SearchInput', () => {
  const OPTIONS = [
    { label: 'Apple', value: 1 },
    { label: 'Banana', value: 2 },
    { label: 'Cherry', value: 3 },
  ];
  const PLACEHOLDER = 'Select fruit';
  const NAME = 'fruit';

  describe('when in single select mode', () => {
    const onChange = jest.fn();

    describe('when nothing is selected', () => {
      beforeEach(() => {
        render(
          <SearchInput 
            options={OPTIONS} 
            placeholder={PLACEHOLDER} 
            name={NAME} 
            onChange={onChange} 
          />
        );
      });

      it('should show the placeholder', () => {
        expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeInTheDocument();
      });

      describe('when the user clicks the input', () => {
        beforeEach(async () => {
          const user = userEvent.setup();
          await user.click(screen.getByPlaceholderText(PLACEHOLDER));
        });

        it('should show all options in the dropdown', () => {
          OPTIONS.forEach(opt => {
            expect(screen.getByText(opt.label)).toBeInTheDocument();
          });
        });

        describe('when the user types a search term', () => {
          beforeEach(async () => {
            const user = userEvent.setup();
            await user.type(screen.getByPlaceholderText(PLACEHOLDER), 'ap');
          });

          it('should filter the options', () => {
            expect(screen.getByText('Apple')).toBeInTheDocument();
            expect(screen.queryByText('Banana')).not.toBeInTheDocument();
          });

          describe('when an option is clicked', () => {
            beforeEach(async () => {
              const user = userEvent.setup();
              await user.click(screen.getByText('Apple'));
            });

            it('should call onChange with the selected value', () => {
              expect(onChange).toHaveBeenCalledWith({ target: { name: NAME, value: 1 } });
            });

            it('should close the dropdown', () => {
              expect(screen.queryByText('Apple')).not.toBeInTheDocument();
            });
          });
        });
      });
    });

    describe('when a value is already selected', () => {
      beforeEach(() => {
        render(
          <SearchInput 
            options={OPTIONS} 
            value={2} 
            name={NAME} 
            onChange={onChange} 
          />
        );
      });

      it('should display the selected option label', () => {
        expect(screen.getByDisplayValue('Banana')).toBeInTheDocument();
      });
    });
  });

  describe('when in multi select mode', () => {
    const onChange = jest.fn();

    describe('when values are selected', () => {
      beforeEach(() => {
        render(
          <SearchInput 
            options={OPTIONS} 
            value={[1, 3]} 
            isMulti={true} 
            name={NAME} 
            onChange={onChange} 
          />
        );
      });

      it('should render tags for the selected options', () => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
        expect(screen.queryByText('Banana')).not.toBeInTheDocument();
      });

      describe('when an option is removed', () => {
        beforeEach(async () => {
          const user = userEvent.setup();
          const appleTag = screen.getByText('Apple').closest('.search-tag');
          const removeButton = appleTag?.querySelector('button');
          if (removeButton) await user.click(removeButton);
        });

        it('should call onChange with the remaining values', () => {
          expect(onChange).toHaveBeenCalledWith({ target: { name: NAME, value: [3] } });
        });
      });
    });
  });

  describe('when states are restricted', () => {
    describe('when it is disabled', () => {
      beforeEach(async () => {
        render(<SearchInput options={OPTIONS} disabled placeholder={PLACEHOLDER} name={NAME} />);
        const user = userEvent.setup();
        await user.click(screen.getByPlaceholderText(PLACEHOLDER));
      });

      it('should NOT open dropdown', () => {
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      });
    });

    describe('when it is readOnly', () => {
      beforeEach(async () => {
        render(<SearchInput options={OPTIONS} readOnly placeholder={PLACEHOLDER} name={NAME} />);
        const user = userEvent.setup();
        await user.click(screen.getByPlaceholderText(PLACEHOLDER));
      });

      it('should NOT open dropdown', () => {
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      });
    });
  });
});
