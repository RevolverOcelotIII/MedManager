import { ApiService } from "./api";
import { Medication } from "@/src/types/medication";

export const MedicationService = {
  getAll: () => ApiService.get<Medication[]>("/medications/"),
  
  getById: (id: number) => ApiService.get<Medication>(`/medications/${id}`),
  
  create: (data: Partial<Medication>) => ApiService.post<Medication>("/medications/", data),
  
  update: (id: number, data: Partial<Medication>) => ApiService.put<Medication>(`/medications/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/medications/${id}`),
};
