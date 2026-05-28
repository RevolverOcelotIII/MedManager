import { Sex, BloodType, Patient } from "@/src/types/patient";
import { ReactNode } from "react";
import { i18n } from "@/src/lib/i18n";

export interface ColumnDefinition<T> {
  name: keyof T | string;
  label: string;
  type: "text" | "date" | "select" | "textarea" | "tel" | "search_input";
  width?: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  grid: boolean;
  form: boolean;
  details?: boolean;
  badge?: boolean;
  render?: (item: T) => ReactNode;
}

export const PATIENT_COLUMNS: ColumnDefinition<Patient>[] = [
  {
    name: "full_name",
    label: i18n.t("models.patient.full_name"),
    type: "text",
    width: "100",
    required: true,
    placeholder: i18n.t("models.patient.full_name"),
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "social_name",
    label: i18n.t("models.patient.social_name"),
    type: "text",
    width: "100",
    placeholder: i18n.t("models.patient.social_name"),
    grid: false,
    form: true,
    details: true,
  },
  {
    name: "cpf",
    label: i18n.t("models.patient.cpf"),
    type: "text",
    width: "50",
    required: true,
    placeholder: "000.000.000-00",
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "rg",
    label: i18n.t("models.patient.rg"),
    type: "text",
    width: "50",
    placeholder: i18n.t("models.patient.rg"),
    grid: false,
    form: true,
    details: true,
  },
  {
    name: "birth_date",
    label: i18n.t("models.patient.birth_date"),
    type: "date",
    width: "50",
    required: true,
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "sex",
    label: i18n.t("models.patient.sex"),
    type: "select",
    width: "50",
    options: Object.values(Sex).map((s) => ({
      label: i18n.t(`enums.sex.${s.toLowerCase()}`),
      value: s,
    })),
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "marital_status",
    label: i18n.t("models.patient.marital_status"),
    type: "text",
    width: "50",
    grid: false,
    form: true,
    details: true,
  },
  {
    name: "nationality",
    label: i18n.t("models.patient.nationality"),
    type: "text",
    width: "50",
    grid: false,
    form: true,
    details: true,
  },
  {
    name: "mother_name",
    label: i18n.t("models.patient.mother_name"),
    type: "text",
    width: "100",
    grid: false,
    form: true,
    details: true,
  },
  {
    name: "phone",
    label: i18n.t("models.patient.phone"),
    type: "tel",
    width: "50",
    placeholder: "(00) 00000-0000",
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "blood_type",
    label: i18n.t("models.patient.blood_type"),
    type: "select",
    width: "50",
    options: Object.values(BloodType).map((bloodType) => ({ label: bloodType, value: bloodType })),
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "allergies",
    label: i18n.t("models.patient.allergies"),
    type: "textarea",
    width: "100",
    grid: false,
    form: true,
    details: true,
  },
];
