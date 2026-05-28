import { Attendance, GravityLevel } from "@/src/types/attendance";
import { AttendanceProcedureStatus } from "@/src/types/attendance_procedure";
import { ColumnDefinition } from "./patient";
import { i18n } from "@/src/lib/i18n";

export const ATTENDANCE_COLUMNS: ColumnDefinition<Attendance>[] = [
  {
    name: "patient_name",
    label: i18n.t("models.attendance.patient"),
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => attendance.patient?.full_name || "—"
  },
  {
    name: "patient_cpf",
    label: i18n.t("models.patient.cpf"),
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => attendance.patient?.cpf || "—"
  },
  {
    name: "patient_id",
    label: i18n.t("models.attendance.patient"),
    type: "search_input",
    width: "100",
    required: true,
    placeholder: i18n.t("models.attendance.patient"),
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "gravity",
    label: i18n.t("models.attendance.gravity"),
    type: "select",
    width: "50",
    required: true,
    options: Object.values(GravityLevel).map((s) => ({
      label: i18n.t(`enums.gravity.${s.toLowerCase()}`),
      value: s,
    })),
    grid: true,
    form: true,
    details: true,
    badge: true,
  },
  {
    name: "current_procedure",
    label: i18n.t("models.attendance_procedure.procedure"),
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => {
      if (!attendance.procedures || attendance.procedures.length === 0) return i18n.t("enums.procedure_status.pending");
      const sortedProcedures = [...attendance.procedures].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      return sortedProcedures[0].procedure.name;
    }
  },
  {
    name: "procedure_status",
    label: i18n.t("models.attendance.status"),
    type: "text",
    grid: true,
    form: false,
    details: true,
    badge: true,
    options: Object.values(AttendanceProcedureStatus).map(s => ({
      label: i18n.t(`enums.procedure_status.${s.toLowerCase()}`),
      value: s
    })),
    render: (attendance: Attendance) => {
      if (!attendance.procedures || attendance.procedures.length === 0) return null;
      const sortedProcedures = [...attendance.procedures].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      return i18n.t(`enums.procedure_status.${sortedProcedures[0].status.toLowerCase()}`);
    }
  },
  {
    name: "created_at",
    label: i18n.t("models.attendance.entry_time"),
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (attendance: Attendance) => new Date(attendance.created_at).toLocaleString(),
  },
];
