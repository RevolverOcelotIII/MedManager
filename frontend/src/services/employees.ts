import { ApiService } from "./api";
import { Employee, Role } from "@/src/types/employee";

export const EmployeeService = {
  getAll: (canExecuteProcedureId?: number, canDispatchProcedureId?: number) => {
    const params: any = {};
    if (canExecuteProcedureId) params.can_execute_procedure_id = canExecuteProcedureId;
    if (canDispatchProcedureId) params.can_dispatch_procedure_id = canDispatchProcedureId;
    
    return ApiService.get<Employee[]>("/employees/", { params });
  },
  
  getById: (id: number) => ApiService.get<Employee>(`/employees/${id}`),
  
  create: (data: Partial<Employee>) => ApiService.post<Employee>("/employees/", data),
  
  update: (id: number, data: Partial<Employee>) => ApiService.put<Employee>(`/employees/${id}`, data),
  
  delete: (id: number) => ApiService.delete(`/employees/${id}`),

  getRoles: () => ApiService.get<Role[]>("/roles"),
};
