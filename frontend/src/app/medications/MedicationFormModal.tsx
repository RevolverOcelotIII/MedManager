"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Medication } from "@/src/types/medication";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { MEDICATION_COLUMNS } from "@/src/models/medication";

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Medication>) => void;
  medication?: Medication | null;
}

export function MedicationFormModal({ isOpen, onClose, onSubmit, medication }: MedicationFormModalProps) {
  const formColumns: FormModalColumn[] = MEDICATION_COLUMNS
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
    <FormModal<Partial<Medication>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={medication ? "Edit Medication" : "New Medication"}
      columns={formColumns}
      initialData={medication || {}}
    />
  );
}
