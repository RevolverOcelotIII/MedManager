export interface FormModalColumn {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "textarea" | "tel";
  width?: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
}

export interface FormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  title: string;
  columns: FormModalColumn[];
  initialData?: T | null;
}
