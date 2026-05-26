import { User } from "@/src/types/user";
import { ColumnDefinition } from "./patient";

export const USER_COLUMNS: ColumnDefinition<User>[] = [
  {
    name: "employee_id",
    label: "Employee",
    type: "search_input",
    width: "100",
    required: true,
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "employee_name",
    label: "Employee",
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (user: User) => user.employee?.full_name || "—"
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    width: "100",
    required: true,
    placeholder: "Enter user email",
    grid: true,
    form: true,
    details: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    width: "50",
    required: true,
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "confirm_password",
    label: "Confirm Password",
    type: "password",
    width: "50",
    required: true,
    grid: false,
    form: true,
    details: false,
  },
  {
    name: "created_at",
    label: "Created At",
    type: "text",
    grid: true,
    form: false,
    details: true,
    render: (user: User) => new Date(user.created_at).toLocaleString(),
  },
];
