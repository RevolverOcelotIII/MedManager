export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum BloodType {
  A_P = "A+",
  A_N = "A-",
  B_P = "B+",
  B_N = "B-",
  AB_P = "AB+",
  AB_N = "AB-",
  O_P = "O+",
  O_N = "O-",
}

export interface Patient {
  id: number;
  full_name: string;
  social_name?: string | null;
  cpf: string;
  rg?: string | null;
  birth_date: string;
  sex?: Sex | null;
  marital_status?: string | null;
  nationality?: string | null;
  mother_name?: string | null;
  phone?: string | null;
  blood_type?: BloodType | null;
  allergies?: string | null;
}
