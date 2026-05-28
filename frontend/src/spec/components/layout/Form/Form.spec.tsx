import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField, Input, Select, Textarea } from '@/src/components/layout/Form/Form';

describe('Form Components', () => {
  describe('FormField', () => {
    const LABEL = 'Test Label';
    const ERROR = 'Test Error';

    describe('when rendered with basic props', () => {
      beforeEach(() => {
        render(
          <FormField label={LABEL}>
            <input data-testid="child" />
          </FormField>
        );
      });

      it('should show the label', () => {
        expect(screen.getByText(LABEL)).toBeInTheDocument();
      });

      it('should render the children', () => {
        expect(screen.getByTestId('child')).toBeInTheDocument();
      });
    });

    describe('when rendered with an error', () => {
      beforeEach(() => {
        render(
          <FormField label={LABEL} error={ERROR}>
            <input />
          </FormField>
        );
      });

      it('should show the error message', () => {
        expect(screen.getByText(ERROR)).toBeInTheDocument();
      });
    });
  });

  describe('Input', () => {
    const PLACEHOLDER = 'Enter text';
    const VALUE = 'Hello';
    const onChange = jest.fn();

    describe('when it is rendered', () => {
      beforeEach(() => {
        render(
          <Input 
            placeholder={PLACEHOLDER} 
            value={VALUE} 
            onChange={onChange} 
          />
        );
      });

      it('should show the correct value', () => {
        expect(screen.getByDisplayValue(VALUE)).toBeInTheDocument();
      });

      describe('when the user types into the input', () => {
        beforeEach(async () => {
          const user = userEvent.setup();
          await user.type(screen.getByPlaceholderText(PLACEHOLDER), 'New');
        });

        it('should call the onChange callback', () => {
          expect(onChange).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Select', () => {
    const OPTIONS = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    const onChange = jest.fn();

    describe('when it is enabled', () => {
      beforeEach(() => {
        render(<Select options={OPTIONS} value="1" onChange={onChange} />);
      });

      it('should render all options', () => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      it('should show the correct selected value', () => {
        expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
      });

      describe('when an option is selected', () => {
        beforeEach(async () => {
          const user = userEvent.setup();
          await user.selectOptions(screen.getByRole('combobox'), '2');
        });

        it('should call the onChange callback', () => {
          expect(onChange).toHaveBeenCalled();
        });
      });
    });

    describe('when it is disabled', () => {
      beforeEach(() => {
        render(<Select options={OPTIONS} disabled />);
      });

      it('should have the disabled class on the container', () => {
        const select = screen.getByRole('combobox');
        expect(select.parentElement).toHaveClass('disabled');
      });
    });
  });

  describe('Textarea', () => {
    const VALUE = 'Long text content';

    beforeEach(() => {
      render(<Textarea defaultValue={VALUE} />);
    });

    it('should render the correct content', () => {
      expect(screen.getByDisplayValue(VALUE)).toBeInTheDocument();
    });
  });
});
