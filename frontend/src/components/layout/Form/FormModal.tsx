"use client";

import { Modal } from "@/src/components/layout/Modal/Modal";
import { FormField, Input, Select, Textarea } from "@/src/components/layout/Form/Form";
import { SearchInput } from "@/src/components/layout/Form/SearchInput";
import { FormModalProps } from "@/src/types/components/layout/Form/FormModal";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/components/layout/form.css";
import { useState, useEffect } from "react";

export function FormModal<T extends Record<string, any>>({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onChange,
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
    const nextData = { ...formData, [name]: value };
    setFormData(nextData);
    if (onChange) {
      onChange(nextData);
    }
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
        {i18n.t("common.cancel")}
      </button>
      <button 
        type="submit" 
        form="form-modal"
        className="button-primary"
      >
        {initialData?.id ? i18n.t("common.save") : i18n.t("common.new")}
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
                  disabled={column.disabled}
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
                  disabled={column.disabled}
                  readOnly={column.readOnly}
                />
              ) : column.type === "textarea" ? (
                <Textarea 
                  name={column.name}
                  value={(formData[column.name] as string) || ""}
                  onChange={handleChange}
                  placeholder={column.placeholder}
                  required={column.required}
                  disabled={column.disabled}
                  readOnly={column.readOnly}
                />
              ) : (
                <Input 
                  name={column.name}
                  type={column.type as any}
                  value={(formData[column.name] as string) || ""}
                  onChange={handleChange}
                  placeholder={column.placeholder}
                  required={column.required}
                  disabled={column.disabled}
                  readOnly={column.readOnly}
                />
              )}
            </FormField>
          ))}
        </div>
      </form>
    </Modal>
  );
}
