"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Patient } from "@/src/types/patient";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { PATIENT_COLUMNS } from "@/src/models/patient";

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Patient>) => void;
  patient?: Patient | null;
}

const formColumns: FormModalColumn[] = PATIENT_COLUMNS
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

export function PatientFormModal({ isOpen, onClose, onSubmit, patient }: PatientFormModalProps) {
  return (
    <FormModal<Partial<Patient>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={patient ? "Edit Patient" : "New Patient"}
      columns={formColumns}
      initialData={patient || {}}
    />
  );
}
