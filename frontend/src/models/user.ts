import { User } from "@/src/types/user";
import { ColumnDefinition } from "./patient";
import { i18n } from "@/src/lib/i18n";

export const USER_COLUMNS: ColumnDefinition<User>[] = [
  {
    name: "employee_id",
    label: i18n.t("models.user.employee"),
    type: "search_input",
    width: "100",
    required: true,
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "employee_name",
    label: i18n.t("models.user.employee"),
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (user: User) => user.employee?.full_name || "—"
  },
  {
    name: "email",
    label: i18n.t("models.user.email"),
    type: "text",
    width: "100",
    required: true,
    placeholder: i18n.t("models.user.email"),
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "password",
    label: i18n.t("models.user.password"),
    type: "password",
    width: "50",
    required: true,
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "confirm_password",
    label: i18n.t("models.user.confirm_password"),
    type: "password",
    width: "50",
    required: true,
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "created_at",
    label: i18n.t("common.created_at"), // Using common since multiple entities have this
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (user: User) => new Date(user.created_at).toLocaleString(),
  },
];
