import { GridProps } from "@/src/types";
import { GridHeader } from "@/src/components/layout/Grid/GridHeader";
import { GridRow } from "@/src/components/layout/Grid/GridRow";
import "@/src/styles/components/layout/grid.css";

export function Grid<T>({ data, columns, rowKey, className }: GridProps<T>) {
  return (
    <div className={`grid-container ${className || ""}`}>
      <div className="table-wrapper">
        <table className="table">
          <GridHeader columns={columns} />
          <tbody>
            {data.map((item) => {
              const key = typeof rowKey === "function" ? rowKey(item) : (item[rowKey] as string | number);
              return (
                <GridRow key={key} item={item} columns={columns} />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
