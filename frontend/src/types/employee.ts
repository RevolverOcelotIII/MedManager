import { Role, AccessLevel } from "./role";
import { Sex } from "./patient";

export enum EmploymentType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACTOR = "Contractor",
  TEMPORARY = "Temporary",
}

export interface Employee {
  id: number;
  full_name: string;
  social_name?: string | null;
  cpf: string;
  rg?: string | null;
  birth_date: string;
  sex?: Sex | null;
  marital_status?: string | null;
  nationality?: string | null;
  phone?: string | null;
  hire_date: string;
  termination_date?: string | null;
  employment_type: EmploymentType;
  salary?: number | null;
  active: boolean;
  role_id: number;
  role?: Role | null;
}
