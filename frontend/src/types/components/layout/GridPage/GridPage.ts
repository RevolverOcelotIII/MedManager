import { GridColumn } from "@/src/types/components/layout/Grid";
import { ReactNode } from "react";

export interface GridPageProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: GridColumn<T>[];
  rowKey: keyof T | ((item: T) => string | number);
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onNewClick?: () => void;
  newButtonLabel?: string;
  extraActions?: ReactNode;
  breadcrumb?: string;
  isLoading?: boolean;
}

export * from "@/src/types/components/layout/GridPage/GridPageHeader";
export * from "@/src/types/components/layout/GridPage/GridPageContainer";
