import { ReactNode } from "react";

export interface GridColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  align?: "left" | "right" | "center";
  badge?: boolean;
  options?: { label: string; value: string | number }[];
}

export interface GridProps<T> {
  data: T[];
  columns: GridColumn<T>[];
  rowKey: keyof T | ((item: T) => string | number);
  className?: string;
  isLoading?: boolean;
}

export interface GridHeaderProps<T> {
  columns: GridColumn<T>[];
}

export interface GridRowProps<T> {
  item: T;
  columns: GridColumn<T>[];
}
