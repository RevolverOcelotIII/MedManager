import { ApiService } from "./api";
import { Procedure } from "@/src/types/procedure";

export const ProcedureService = {
  getAll: () => ApiService.get<Procedure[]>("/procedures/"),
  
  getById: (id: number) => ApiService.get<Procedure>(`/procedures/${id}`),
  
  create: (data: Partial<Procedure>) => ApiService.post<Procedure>("/procedures/", data),
  
  update: (id: number, data: Partial<Procedure>) => ApiService.put<Procedure>(`/procedures/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/procedures/${id}`),
};
