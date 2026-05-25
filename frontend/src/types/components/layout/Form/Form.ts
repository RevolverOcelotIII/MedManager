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

export interface SearchInputProps {
  name: string;
  value?: string | number | (string | number)[];
  onChange?: (e: { target: { name: string; value: string | number | (string | number)[] } }) => void;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  required?: boolean;
  width?: "50" | "100";
  isMulti?: boolean;
}
