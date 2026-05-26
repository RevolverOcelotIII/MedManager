import { ApiService } from "./api";
import { Employee, Role } from "@/src/types/employee";

export const EmployeeService = {
  getAll: () => ApiService.get<Employee[]>("/employees/"),
  
  getById: (id: number) => ApiService.get<Employee>(`/employees/${id}`),
  
  create: (data: Partial<Employee>) => ApiService.post<Employee>("/employees/", data),
  
  update: (id: number, data: Partial<Employee>) => ApiService.put<Employee>(`/employees/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/employees/${id}`),

  getRoles: () => ApiService.get<Role[]>("/roles"),
};
