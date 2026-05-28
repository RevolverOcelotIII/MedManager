import { ApiService } from "./api";
import { AttendanceProcedure } from "@/src/types/attendance_procedure";

export const AttendanceProcedureService = {
  getByAttendance: (attendanceId: number) => 
    ApiService.get<AttendanceProcedure[]>(`/attendance-procedures/attendance/${attendanceId}`),
  
  getById: (id: number) => 
    ApiService.get<AttendanceProcedure>(`/attendance-procedures/${id}`),
  
  create: (data: Partial<AttendanceProcedure> & { medication_ids?: number[] }) => 
    ApiService.post<AttendanceProcedure>("/attendance-procedures/", data),
  
  update: (id: number, data: Partial<AttendanceProcedure> & { medication_ids?: number[] }) => 
    ApiService.put<AttendanceProcedure>(`/attendance-procedures/${id}`, data),
  
  delete: (id: number) => 
    ApiService.delete(`/attendance-procedures/${id}`),
};
