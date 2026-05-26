import { Role, AccessLevel } from "@/src/types/role";
import { ColumnDefinition } from "./patient";

export const ROLE_COLUMNS: ColumnDefinition<Role>[] = [
  {
    name: "name",
    label: "Role Name",
    type: "text",
    width: "50",
    required: true,
    placeholder: "Ex: Clinical Doctor",
    grid: true,
    form: true,
  },
  {
    name: "access_level",
    label: "Access Category",
    type: "select",
    width: "50",
    required: true,
    options: Object.values(AccessLevel).map((level) => ({
      label: level.charAt(0).toUpperCase() + level.slice(1),
      value: level
    })),
    grid: true,
    form: true,
    badge: true,
  },
];
