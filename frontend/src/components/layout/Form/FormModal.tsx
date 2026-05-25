"use client";

import { Modal } from "@/src/components/layout/Modal/Modal";
import { FormField, Input, Select } from "@/src/components/layout/Form/Form";
import { FormModalProps } from "@/src/types/components/layout/Form/FormModal";
import "@/src/styles/components/layout/form.css";

export function FormModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  title,
  columns,
  initialData,
  submitLabel,
}: FormModalProps<T>) {
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    
    columns.forEach(col => {
      data[col.name] = formData.get(col.name);
    });
    
    onSubmit(data as T);
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
        form="dynamic-form"
        className="button-primary"
      >
        {submitLabel || (initialData ? "Save Changes" : "Create")}
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
      <form id="dynamic-form" className="form-container" onSubmit={handleSubmit}>
        <div className="form-row">
          {columns.map((column) => (
            <FormField 
              key={column.name} 
              label={column.label} 
              width={column.width}
            >
              {column.type === "select" ? (
                <Select
                  name={column.name}
                  defaultValue={initialData?.[column.name] || ""}
                  options={column.options || []}
                  required={column.required}
                />
              ) : (
                <Input
                  name={column.name}
                  type={column.type}
                  defaultValue={initialData?.[column.name] || ""}
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
