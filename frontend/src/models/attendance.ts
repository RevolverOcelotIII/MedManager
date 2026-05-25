import { Attendance, GravityLevel } from "@/src/types/attendance";
import { AttendanceProcedureStatus } from "@/src/types/attendance_procedure";
import { ColumnDefinition } from "./patient";

export const ATTENDANCE_COLUMNS: ColumnDefinition<Attendance>[] = [
  {
    name: "patient_name",
    label: "Patient name",
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => attendance.patient?.full_name || "—"
  },
  {
    name: "patient_cpf",
    label: "Patient CPF",
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => attendance.patient?.cpf || "—"
  },
  {
    name: "patient_id",
    label: "Patient",
    type: "search_input",
    width: "100",
    required: true,
    placeholder: "Search patient by name or CPF",
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "gravity",
    label: "Priority",
    type: "select",
    width: "50",
    required: true,
    options: Object.values(GravityLevel).map((level) => ({
      label: level.charAt(0).toUpperCase() + level.slice(1),
      value: level
    })),
    grid: true,
    form: true,
    details: true,
    badge: true,
  },
  {
    name: "current_procedure",
    label: "Current Procedure",
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => {
      if (!attendance.procedures || attendance.procedures.length === 0) return "Waiting Triage";
      const sortedProcedures = [...attendance.procedures].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      return sortedProcedures[0].procedure.name;
    }
  },
  {
    name: "procedure_status",
    label: "Status",
    type: "text",
    grid: true,
    form: false,
    details: true,
    badge: true,
    options: Object.values(AttendanceProcedureStatus).map(status => ({
      label: status.replace('_', ' '),
      value: status
    })),
    render: (attendance: Attendance) => {
      if (!attendance.procedures || attendance.procedures.length === 0) return null;
      const sortedProcedures = [...attendance.procedures].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      return sortedProcedures[0].status;
    }
  },
  {
    name: "created_at",
    label: "Arrival Time",
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => new Date(attendance.created_at).toLocaleString(),
  },
];
