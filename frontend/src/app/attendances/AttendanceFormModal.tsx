"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Attendance } from "@/src/types/attendance";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { ATTENDANCE_COLUMNS } from "@/src/models/attendance";

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Attendance>) => void;
  attendance?: Attendance | null;
}

export function AttendanceFormModal({ isOpen, onClose, onSubmit, attendance }: AttendanceFormModalProps) {
  const formColumns: FormModalColumn[] = ATTENDANCE_COLUMNS
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
    <FormModal<Partial<Attendance>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={attendance ? "Edit Attendance" : "New Attendance"}
      columns={formColumns}
      initialData={attendance || {}}
    />
  );
}
