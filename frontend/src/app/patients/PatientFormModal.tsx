"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Patient } from "@/src/types/patient";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { PATIENT_COLUMNS } from "@/src/models/patient";
import { PatientFormModalProps } from "@/src/types/app/patients/PatientFormModal";
import { i18n } from "@/src/lib/i18n"

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
      title={patient ? i18n.t("pages.patients.edit_title") : i18n.t("pages.patients.new_title")}
      columns={formColumns}
      initialData={patient || {}}
    />
  );
}
