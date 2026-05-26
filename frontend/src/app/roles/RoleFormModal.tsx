"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Role } from "@/src/types/role";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { ROLE_COLUMNS } from "@/src/models/role";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Role>) => void;
  role?: Role | null;
}

export function RoleFormModal({ isOpen, onClose, onSubmit, role }: RoleFormModalProps) {
  const formColumns: FormModalColumn[] = ROLE_COLUMNS
    .filter(column => column.form)
    .map(column => ({
      name: column.name,
      label: column.label,
      type: column.type as any,
      width: column.width,
      required: column.required,
      placeholder: column.placeholder,
      options: column.options,
    }));

  return (
    <FormModal<Partial<Role>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={role ? "Edit Role" : "New Role"}
      columns={formColumns}
      initialData={role || {}}
    />
  );
}
