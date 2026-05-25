import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

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

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  width?: "50" | "100";
}
