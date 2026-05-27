import { useMemo } from "react";
import { GridProps } from "@/src/types";
import { GridHeader } from "@/src/components/layout/Grid/GridHeader";
import { GridRow } from "@/src/components/layout/Grid/GridRow";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/components/layout/grid.css";

export function Grid<T>({ data, columns, rowKey, className, isLoading }: GridProps<T>) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date((a as any).updated_at || 0).getTime();
      const dateB = new Date((b as any).updated_at || 0).getTime();
      return dateB - dateA;
    });
  }, [data]);

  return (
    <div className={`grid-container ${className || ""}`}>
      <div className="table-wrapper">
        <table className="table">
          <GridHeader columns={columns} />
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="loading-cell">
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <span>{i18n.t("common.loading")}</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-cell">
                  {i18n.t("common.no_data")}
                </td>
              </tr>
            ) : (
              sortedData.map((item) => {
                const key = typeof rowKey === "function" ? rowKey(item) : (item[rowKey] as string | number);
                return (
                  <GridRow key={key} item={item} columns={columns} />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
