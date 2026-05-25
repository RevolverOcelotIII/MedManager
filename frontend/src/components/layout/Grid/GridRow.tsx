import { GridRowProps } from "@/src/types";
import "@/src/styles/components/layout/grid.css";

export function GridRow<T>({ item, columns }: GridRowProps<T>) {
  return (
    <tr className="grid-tr">
      {columns.map((column, index) => {
        let content: React.ReactNode;
        
        const value = typeof column.accessor === "function" 
          ? column.accessor(item) 
          : (item[column.accessor as keyof T]);

        if (column.badge && column.options) {
          const optionIndex = column.options.findIndex(opt => opt.value === value);
          const colorIndex = optionIndex !== -1 ? (optionIndex % 10) + 1 : 1;
          const label = column.options.find(opt => opt.value === value)?.label || String(value);
          
          content = (value !== null && value !== undefined && value !== "") ? (
            <span className={`badge color-${colorIndex}`}>
              {label}
            </span>
          ) : null;
        } else {
          content = value as React.ReactNode;
        }

        return (
          <td
            key={index}
            className={`grid-td ${column.align === 'right' ? 'td-right' : column.align === 'center' ? 'td-center' : ''} ${column.className || ''}`}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
