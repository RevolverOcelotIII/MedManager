"use client";

import { Modal } from "@/src/components/layout/Modal/Modal";
import { FormField, Input, Select, Textarea } from "@/src/components/layout/Form/Form";
import { FormModalProps } from "@/src/types/components/layout/Form/FormModal";
import "@/src/styles/components/layout/form.css";

export function FormModal<T extends Record<string, any>>({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  columns, 
  initialData 
}: FormModalProps<T>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as T;
    onSubmit(data);
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
                  defaultValue={(initialData?.[column.name] as string) || (column.options?.[0]?.value as string)}
                  options={column.options || []}
                  required={column.required}
                />
              ) : column.type === "textarea" ? (
                <Textarea 
                  name={column.name}
                  defaultValue={initialData?.[column.name] as string}
                  placeholder={column.placeholder}
                  required={column.required}
                />
              ) : (
                <Input 
                  name={column.name}
                  type={column.type}
                  defaultValue={initialData?.[column.name] as string}
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
