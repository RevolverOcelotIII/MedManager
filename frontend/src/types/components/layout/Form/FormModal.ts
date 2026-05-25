export interface FormModalColumn {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "email" | "password" | "number";
  options?: { label: string; value: string | number }[];
  width?: "50" | "100";
  placeholder?: string;
  required?: boolean;
}

export interface FormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  title: string;
  columns: FormModalColumn[];
  initialData?: T | null;
  submitLabel?: string;
}
