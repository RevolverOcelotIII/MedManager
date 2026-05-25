import { Patient } from "./patient";
import { AttendanceProcedure } from "./attendance_procedure";

export enum GravityLevel {
  red = "red",
  orange = "orange",
  yellow = "yellow",
  green = "green",
  blue = "blue",
}

export interface Attendance {
  id: number;
  patient_id: number;
  patient?: Patient;
  gravity: GravityLevel;
  finished_at?: string;
  created_at: string;
  updated_at: string;
  procedures?: AttendanceProcedure[];
}
