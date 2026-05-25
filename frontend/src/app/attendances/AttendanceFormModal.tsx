"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Attendance } from "@/src/types/attendance";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { ATTENDANCE_COLUMNS } from "@/src/models/attendance";
import { useGetAttendanceFormData } from "@/src/hooks/useGetAttendanceFormData";

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attendanceData: Partial<Attendance>) => void;
  attendance?: Attendance | null;
}

export function AttendanceFormModal({ isOpen, onClose, onSubmit, attendance }: AttendanceFormModalProps) {
  const { patientOptions, isLoading: isDataLoading } = useGetAttendanceFormData();

  const formColumns: FormModalColumn[] = ATTENDANCE_COLUMNS
    .filter((column) => column.form)
    .map((column) => {
      if (column.name === "patient_id") {
        return {
          ...column,
          options: patientOptions,
        };
      }
      return {
        name: column.name,
        label: column.label,
        type: column.type,
        width: column.width,
        required: column.required,
        placeholder: column.placeholder,
        options: column.options,
      };
    });

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
