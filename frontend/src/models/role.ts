import { Role, AccessLevel } from "@/src/types/role";
import { ColumnDefinition } from "./patient";
import { i18n } from "@/src/lib/i18n";

export const ROLE_COLUMNS: ColumnDefinition<Role>[] = [
  {
    name: "name",
    label: i18n.t("models.role.name"),
    type: "text",
    width: "50",
    required: true,
    placeholder: i18n.t("models.role.name"),
    grid: true,
    form: true,
  },
  {
    name: "access_level",
    label: i18n.t("models.role.access_level"),
    type: "select",
    width: "50",
    required: true,
    options: Object.values(AccessLevel).map((s) => ({
      label: i18n.t(`enums.access_level.${s.toLowerCase()}`),
      value: s
    })),
    grid: true,
    form: true,
    badge: true,
  },
];
