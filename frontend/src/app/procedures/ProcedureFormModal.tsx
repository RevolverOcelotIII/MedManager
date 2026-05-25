"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Procedure } from "@/src/types/procedure";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { PROCEDURE_COLUMNS } from "@/src/models/procedure";

interface ProcedureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Procedure>) => void;
  procedure?: Procedure | null;
}

export function ProcedureFormModal({ isOpen, onClose, onSubmit, procedure }: ProcedureFormModalProps) {
  const formColumns: FormModalColumn[] = PROCEDURE_COLUMNS
    .filter(column => column.form)
    .map(column => ({
      name: column.name,
      label: column.label,
      type: column.type,
      width: column.width,
      required: column.required,
      placeholder: column.placeholder,
      options: column.options,
    }));

  return (
    <FormModal<Partial<Procedure>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={procedure ? "Edit Procedure" : "New Procedure"}
      columns={formColumns}
      initialData={procedure || {}}
    />
  );
}
