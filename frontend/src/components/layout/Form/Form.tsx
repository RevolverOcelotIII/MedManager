"use client";

import { FormFieldProps, InputProps, SelectProps, TextareaProps } from "@/src/types/components/layout/Form/Form";
import { FaChevronDown } from "react-icons/fa";
import "@/src/styles/components/layout/form.css";

export function FormField({ label, children, width = "100", error }: FormFieldProps) {
  return (
    <div className={`form-field width-${width}`}>
      <label className="form-label">{label}</label>
      <div className="form-input-container">
        {children}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function Input({ width, ...props }: InputProps) {
  return (
    <input className="form-input" {...props} />
  );
}

export function Select({ width, options, ...props }: SelectProps) {
  return (
    <div className="form-input-container">
      <select className="form-select" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FaChevronDown className="select-icon" size={16} />
    </div>
  );
}

export function Textarea({ width, ...props }: TextareaProps) {
  return (
    <textarea className="form-input form-textarea" {...props} />
  );
}
