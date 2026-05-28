export enum AccessLevel {
  admin = "admin",
  doctor = "doctor",
  nurse = "nurse",
  pharmaceutical = "pharmaceutical",
  attendant = "attendant",
}

export interface Role {
  id: number;
  name: string;
  access_level: AccessLevel;
  created_at: string;
  updated_at: string;
}
