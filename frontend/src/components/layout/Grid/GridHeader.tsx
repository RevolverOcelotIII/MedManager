import { GridHeaderProps } from "@/src/types";
import "@/src/styles/components/layout/grid.css";

export function GridHeader<T>({ columns }: GridHeaderProps<T>) {
  return (
    <thead className="grid-thead">
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className={`grid-th ${column.align === 'right' ? 'th-right' : column.align === 'center' ? 'th-center' : ''} ${column.className || ''}`}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
