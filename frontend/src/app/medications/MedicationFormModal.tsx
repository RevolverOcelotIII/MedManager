"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Medication } from "@/src/types/medication";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { MEDICATION_COLUMNS } from "@/src/models/medication";
import { i18n } from "@/src/lib/i18n";

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
      title={medication ? i18n.t("pages.medications.edit_title") : i18n.t("pages.medications.new_title")}
      columns={formColumns}
      initialData={medication || {}}
    />
  );
}
