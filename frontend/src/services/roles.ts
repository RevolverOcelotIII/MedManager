import { ApiService } from "./api";
import { Role } from "@/src/types/role";

export const RoleService = {
  getAll: () => ApiService.get<Role[]>("/roles/"),
  
  getById: (id: number) => ApiService.get<Role>(`/roles/${id}`),
  
  create: (data: Partial<Role>) => ApiService.post<Role>("/roles/", data),
  
  update: (id: number, data: Partial<Role>) => ApiService.put<Role>(`/roles/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/roles/${id}`),
};
