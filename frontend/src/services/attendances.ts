import { ApiService } from "./api";
import { Attendance } from "@/src/types/attendance";

export const AttendanceService = {
  getAll: () => ApiService.get<Attendance[]>("/attendances/"),
  
  getById: (id: number) => ApiService.get<Attendance>(`/attendances/${id}`),
  
  create: (data: Partial<Attendance>) => ApiService.post<Attendance>("/attendances/", data),
  
  update: (id: number, data: Partial<Attendance>) => ApiService.put<Attendance>(`/attendances/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/attendances/${id}`),
};
