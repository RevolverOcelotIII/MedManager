export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

export interface LoginFormData {
  username: string;
  password?: string;
}
