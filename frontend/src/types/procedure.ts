import { Role } from "./employee";

export enum ProcedureCategory {
  screening = "screening",
  exam = "exam",
  surgery = "surgery",
  consultation = "consultation",
  nursing = "nursing",
  therapy = "therapy",
  other = "other",
}

export interface Procedure {
  id: number;
  name: string;
  code?: string | null;
  category: ProcedureCategory;
  description?: string | null;
  responsible_roles: Role[];
}
