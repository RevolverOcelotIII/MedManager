import { ReactNode } from "react";

export interface GridPageHeaderProps {
  title: string;
  description?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onNewClick?: () => void;
  newButtonLabel?: string;
  extraActions?: ReactNode;
}
