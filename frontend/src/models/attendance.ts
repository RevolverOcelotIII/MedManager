import { Attendance, AttendanceStatus } from "@/src/types/attendance";
import { ColumnDefinition } from "./patient";

export const ATTENDANCE_COLUMNS: ColumnDefinition<Attendance>[] = [
  {
    name: "patient_id",
    label: "Patient ID",
    type: "text",
    width: "25",
    required: true,
    grid: true,
    form: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    width: "25",
    required: true,
    options: Object.values(AttendanceStatus).map((status) => ({
      label: status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: status
    })),
    grid: true,
    form: true,
  },
  {
    name: "triage_notes",
    label: "Triage Notes",
    type: "textarea",
    width: "100",
    grid: false,
    form: true,
  },
  {
    name: "vitals_bp",
    label: "Blood Pressure",
    type: "text",
    width: "50",
    placeholder: "e.g. 120/80",
    grid: true,
    form: true,
  },
  {
    name: "vitals_temp",
    label: "Temperature",
    type: "text",
    width: "50",
    placeholder: "e.g. 36.5°C",
    grid: true,
    form: true,
  },
  {
    name: "doctor_notes",
    label: "Doctor Notes",
    type: "textarea",
    width: "100",
    grid: false,
    form: true,
  },
];
