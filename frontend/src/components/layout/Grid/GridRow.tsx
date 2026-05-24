import { GridRowProps } from "@/src/types";
import "@/src/styles/components/layout/grid.css";

export function GridRow<T>({ item, columns }: GridRowProps<T>) {
  return (
    <tr className="grid-tr">
      {columns.map((column, index) => {
        const content = typeof column.accessor === "function" 
          ? column.accessor(item) 
          : (item[column.accessor] as React.ReactNode);

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
