export interface FormModalColumn {
  name: string;
  label: string;
  type: "text" | "date" | "time" | "datetime-local" | "select" | "textarea" | "tel" | "search_input" | "multi_search_input" | "password";
  width?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  options?: { label: string; value: string | number }[];
}

export interface FormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  onChange?: (data: T) => void;
  title: string;
  columns: FormModalColumn[];
  initialData?: T | null;
}
