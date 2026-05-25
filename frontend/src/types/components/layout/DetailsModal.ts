import { ReactNode } from "react";
import { ColumnDefinition } from "@/src/models/patient";

export interface DetailsModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: T | null;
  columns: ColumnDefinition<T>[];
  sections?: {
    title: string;
    fields: string[];
  }[];
  customContent?: ReactNode;
}
