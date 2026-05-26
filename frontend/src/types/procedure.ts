import { Role } from "./role";

export enum ProcedureCategory {
  screening = "screening",
  exam = "exam",
  surgery = "surgery",
  consultation = "consultation",
  nursing = "nursing",
  therapy = "therapy",
  request = "request",
  attendance = "attendance",
  other = "other",
}

export interface Procedure {
  id: number;
  name: string;
  code?: string | null;
  category: ProcedureCategory;
  description?: string | null;
  dispatch_roles: Role[];
  execute_roles: Role[];
}
