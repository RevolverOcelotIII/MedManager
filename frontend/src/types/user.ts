import { Employee } from "./employee";

export interface User {
  id: number;
  email: string;
  employee_id: number;
  employee?: Employee;
  created_at: string;
  updated_at: string;
}
