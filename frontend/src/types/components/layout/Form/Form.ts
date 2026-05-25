import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export interface FormFieldProps {
  label: string;
  children: ReactNode;
  width?: "50" | "100";
  error?: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  width?: "50" | "100";
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  width?: "50" | "100";
  options: { label: string; value: string | number }[];
}
