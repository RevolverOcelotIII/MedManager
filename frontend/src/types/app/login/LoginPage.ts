export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

export interface LoginFormData {
  email: string;
  password?: string;
}
