"use client";

import { Modal } from "@/src/components/layout/Modal/Modal";
import { FormField, Input, Select, Textarea } from "@/src/components/layout/Form/Form";
import { SearchInput } from "@/src/components/layout/Form/SearchInput";
import { FormModalProps } from "@/src/types/components/layout/Form/FormModal";
import "@/src/styles/components/layout/form.css";
import { useState, useEffect } from "react";

export function FormModal<T extends Record<string, any>>({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  columns, 
  initialData 
}: FormModalProps<T>) {
  const [formData, setFormData] = useState<T>((initialData || {}) as T);

  useEffect(() => {
    setFormData((initialData || {}) as T);
  }, [initialData, isOpen]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const footer = (
    <>
      <button 
        type="button" 
        className="button-secondary" 
        onClick={onClose}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        form="form-modal"
        className="button-primary"
      >
        {initialData ? "Save Changes" : "Create"}
      </button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      footer={footer}
    >
      <form id="form-modal" className="form-content" onSubmit={handleSubmit}>
        <div className="form-row">
          {columns.map((column) => (
            <FormField 
              key={column.name} 
              label={column.label} 
              width={column.width as "50" | "100"}
            >
              {column.type === "select" ? (
                <Select 
                  name={column.name}
                  value={(formData[column.name] as string) || ""}
                  onChange={handleChange}
                  options={column.options || []}
                  required={column.required}
                />
              ) : column.type === "search_input" || column.type === "multi_search_input" ? (
                <SearchInput
                  name={column.name}
                  value={formData[column.name] || (column.type === "multi_search_input" ? [] : "")}
                  onChange={handleChange}
                  options={column.options || []}
                  placeholder={column.placeholder}
                  required={column.required}
                  isMulti={column.type === "multi_search_input"}
                />
              ) : column.type === "textarea" ? (
                <Textarea 
                  name={column.name}
                  value={(formData[column.name] as string) || ""}
                  onChange={handleChange}
                  placeholder={column.placeholder}
                  required={column.required}
                />
              ) : (
                <Input 
                  name={column.name}
                  type={column.type}
                  value={(formData[column.name] as string) || ""}
                  onChange={handleChange}
                  placeholder={column.placeholder}
                  required={column.required}
                />
              )}
            </FormField>
          ))}
        </div>
      </form>
    </Modal>
  );
}
