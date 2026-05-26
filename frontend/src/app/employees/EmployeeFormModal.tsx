"use client";

import { useEffect, useState } from "react";
import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Employee, Role } from "@/src/types/employee";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { EMPLOYEE_COLUMNS } from "@/src/models/employee";
import { EmployeeService } from "@/src/services/employees";
import { i18n } from "@/src/lib/i18n";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => void;
  employee?: Employee | null;
}

export function EmployeeFormModal({ isOpen, onClose, onSubmit, employee }: EmployeeFormModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (isOpen) {
      EmployeeService.getRoles()
        .then(setRoles)
        .catch(error => console.error("Failed to fetch roles:", error));
    }
  }, [isOpen]);

  const formColumns: FormModalColumn[] = EMPLOYEE_COLUMNS
    .filter(column => column.form)
    .map(column => {
      if (column.name === "role_id") {
        return {
          ...column,
          options: roles.map(role => ({ label: role.name, value: role.id }))
        };
      }
      return {
        name: column.name,
        label: column.label,
        type: column.type,
        width: column.width,
        required: column.required,
        placeholder: column.placeholder,
        options: column.options,
      };
    });

  return (
    <FormModal<Partial<Employee>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={employee ? i18n.t("pages.employees.edit_title") : i18n.t("pages.employees.new_title")}
      columns={formColumns}
      initialData={employee || {}}
    />
  );
}
