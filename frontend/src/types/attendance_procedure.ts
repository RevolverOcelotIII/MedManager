import { Procedure } from "./procedure";
import { Employee } from "./employee";
import { Medication } from "./medication";

export enum AttendanceProcedureStatus {
  pending = "pending",
  in_progress = "in_progress",
  done = "done",
  canceled = "canceled",
}

export interface AttendanceProcedure {
  id: number;
  attendance_id: number;
  procedure_id: number;
  procedure: Procedure;
  status: AttendanceProcedureStatus;
  description?: string | null;
  start_time?: string;
  end_time?: string;
  ordered_by_id?: number;
  ordered_by?: Employee;
  executed_by_id?: number;
  executed_by?: Employee;
  medications: Medication[];
  created_at: string;
  updated_at: string;
}
