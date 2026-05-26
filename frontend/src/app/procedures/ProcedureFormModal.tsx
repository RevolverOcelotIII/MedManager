"use client";

import { useMemo } from "react";
import { FormModal } from "@/src/components/layout/Form/FormModal";
import { Procedure } from "@/src/types/procedure";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { PROCEDURE_COLUMNS } from "@/src/models/procedure";
import { useGetProcedureFormData } from "@/src/hooks/useGetProcedureFormData";
import { i18n } from "@/src/lib/i18n";

interface ProcedureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  procedure?: Procedure | null;
}

export function ProcedureFormModal({ isOpen, onClose, onSubmit, procedure }: ProcedureFormModalProps) {
  const { roleOptions, isLoading: isDataLoading } = useGetProcedureFormData();

  const formColumns: FormModalColumn[] = PROCEDURE_COLUMNS
    .filter(column => column.form)
    .map(column => {
      if (column.name === "responsible_role_ids") {
        return {
          ...column,
          options: roleOptions
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

  const initialData = useMemo(() => {
    if (!procedure) return {};
    return {
      ...procedure,
      responsible_role_ids: procedure.responsible_roles?.map(r => r.id) || []
    };
  }, [procedure]);

  const handleFormSubmit = (formData: any) => {
    const payload = {
      ...formData,
      responsible_role_ids: typeof formData.responsible_role_ids === 'string'
        ? JSON.parse(formData.responsible_role_ids)
        : formData.responsible_role_ids
    };
    onSubmit(payload);
  };

  return (
    <FormModal<Partial<Procedure>>
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleFormSubmit}
      title={procedure ? i18n.t("pages.procedures.edit_title") : i18n.t("pages.procedures.new_title")}
      columns={formColumns}
      initialData={initialData}
    />
  );
}
