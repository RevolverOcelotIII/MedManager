import { Procedure, ProcedureCategory } from "@/src/types/procedure";
import { ColumnDefinition } from "./patient";

export const PROCEDURE_COLUMNS: ColumnDefinition<Procedure>[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    width: "100",
    required: true,
    placeholder: "Ex: Raio-X de Tórax",
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "code",
    label: "Code",
    type: "text",
    width: "25",
    placeholder: "SIGTAP/SUS Code",
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    width: "25",
    required: true,
    options: Object.values(ProcedureCategory).map((cat) => ({ 
      label: cat.charAt(0).toUpperCase() + cat.slice(1), 
      value: cat 
    })),
    grid: true,
    form: true,
    details: true,
    badge: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    width: "100",
    placeholder: "Enter procedure description",
    grid: false,
    form: true,
    details: true,
  },
];
