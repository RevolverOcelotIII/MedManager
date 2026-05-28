"use client";

import { FormModal } from "@/src/components/layout/Form/FormModal";
import { User } from "@/src/types/user";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { USER_COLUMNS } from "@/src/models/user";
import { useGetUserFormData } from "@/src/hooks/useGetUserFormData";
import { i18n } from "@/src/lib/i18n";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User> & { password?: string }) => void;
  user?: User | null;
}

export function UserFormModal({ isOpen, onClose, onSubmit, user }: UserFormModalProps) {
  const { employeeOptions } = useGetUserFormData();

  const handleFormSubmit = (formData: any) => {
    if (formData.password !== formData.confirm_password) {
      alert(i18n.t("models.user.passwords_mismatch"));
      return;
    }

    const { ...payload } = formData;
    onSubmit(payload);
  };

  const formColumns: FormModalColumn[] = USER_COLUMNS
    .filter((column) => column.form)
    .map((column) => {
      if (column.name === "employee_id") {
        return {
          ...column,
          options: employeeOptions,
        } as FormModalColumn;
      }
      
      if (user && (column.name === "password" || column.name === "confirm_password")) {
        return {
          ...column,
          required: false,
          placeholder: i18n.t("models.user.keep_current")
        } as FormModalColumn;
      }

      return {
        name: column.name,
        label: column.label,
        type: column.type as any,
        width: column.width,
        required: column.required,
        placeholder: column.placeholder,
        options: column.options,
      } as FormModalColumn;
    });

  return (
    <FormModal<Partial<User>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleFormSubmit}
      title={user ? i18n.t("pages.users.edit_title") : i18n.t("pages.users.new_title")}
      columns={formColumns}
      initialData={user || {}}
    />
  );
}
