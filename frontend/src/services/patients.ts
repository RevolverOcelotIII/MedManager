import { ApiService } from "./api";
import { Patient } from "@/src/types/patient";

export const PatientService = {
  getAll: () => ApiService.get<Patient[]>("/patients/"),
  
  getById: (id: number) => ApiService.get<Patient>(`/patients/${id}`),
  
  create: (data: Partial<Patient>) => ApiService.post<Patient>("/patients/", data),
  
  update: (id: number, data: Partial<Patient>) => ApiService.put<Patient>(`/patients/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/patients/${id}`),
};
