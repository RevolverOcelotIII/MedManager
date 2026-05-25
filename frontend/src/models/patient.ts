import { Sex, BloodType, Patient } from "@/src/types/patient";

export interface ColumnDefinition {
  name: keyof Patient;
  label: string;
  type: "text" | "date" | "select" | "textarea" | "tel";
  width?: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  grid: boolean;
  form: boolean;
}

export const PATIENT_COLUMNS: ColumnDefinition[] = [
  {
    name: "full_name",
    label: "Full Name",
    type: "text",
    width: "100",
    required: true,
    placeholder: "Enter full name",
    grid: true,
    form: true,
  },
  {
    name: "social_name",
    label: "Social Name",
    type: "text",
    width: "100",
    placeholder: "Enter social name (optional)",
    grid: false,
    form: true,
  },
  {
    name: "cpf",
    label: "CPF",
    type: "text",
    width: "50",
    required: true,
    placeholder: "000.000.000-00",
    grid: true,
    form: true,
  },
  {
    name: "rg",
    label: "RG",
    type: "text",
    width: "50",
    placeholder: "Enter RG",
    grid: false,
    form: true,
  },
  {
    name: "birth_date",
    label: "Birth Date",
    type: "date",
    width: "50",
    required: true,
    grid: true,
    form: true,
  },
  {
    name: "sex",
    label: "Sex",
    type: "select",
    width: "50",
    options: [
      { label: "Male", value: Sex.MALE },
      { label: "Female", value: Sex.FEMALE },
      { label: "Other", value: Sex.OTHER },
    ],
    grid: true,
    form: true,
  },
  {
    name: "marital_status",
    label: "Marital Status",
    type: "text",
    width: "50",
    grid: false,
    form: true,
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
    width: "50",
    grid: false,
    form: true,
  },
  {
    name: "mother_name",
    label: "Mother's Name",
    type: "text",
    width: "100",
    grid: false,
    form: true,
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    width: "50",
    placeholder: "(00) 00000-0000",
    grid: true,
    form: true,
  },
  {
    name: "blood_type",
    label: "Blood Type",
    type: "select",
    width: "50",
    options: Object.values(BloodType).map((bloodType) => ({ label: bloodType, value: bloodType })),
    grid: true,
    form: true,
  },
  {
    name: "allergies",
    label: "Allergies",
    type: "textarea",
    width: "100",
    grid: false,
    form: true,
  },
];
