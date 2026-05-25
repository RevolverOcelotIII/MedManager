import { Patient } from "./patient";

export enum AttendanceStatus {
  waiting_triage = "waiting_triage",
  waiting_consultation = "waiting_consultation",
  waiting_medication = "waiting_medication",
  medical_return = "medical_return",
  finished = "finished",
  cancelled = "cancelled",
}

export interface Attendance {
  id: number;
  patient_id: number;
  patient?: Patient;
  status: AttendanceStatus;
  triage_notes?: string;
  vitals_bp?: string;
  vitals_temp?: string;
  doctor_notes?: string;
  finished_at?: string;
  created_at: string;
  updated_at: string;
}
