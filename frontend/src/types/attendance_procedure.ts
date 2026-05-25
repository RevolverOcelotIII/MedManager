import { Procedure } from "./procedure";
import { Employee } from "./employee";
import { Medication } from "./medication";

export interface AttendanceProcedure {
  id: number;
  attendance_id: number;
  procedure_id: number;
  procedure: Procedure;
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
