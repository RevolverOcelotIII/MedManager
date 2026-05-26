"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Procedure } from "@/src/types/procedure";
import { PROCEDURE_COLUMNS } from "@/src/models/procedure";
import { ProcedureFormModal } from "@/src/app/procedures/ProcedureFormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { ProcedureService } from "@/src/services/procedures";
import { useAuth } from "@/src/hooks/useAuth";
import { AccessLevel } from "@/src/types/role";
import { i18n } from "@/src/lib/i18n";
import "@/src/styles/app/patients.css";

export default function ProceduresPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProcedures = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await ProcedureService.getAll();
      setProcedures(data);
    } catch (error) {
      console.error("Failed to fetch procedures:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (user?.employee?.role?.access_level !== AccessLevel.admin) {
        router.push("/patients");
      } else {
        fetchProcedures();
      }
    }
  }, [isAuthLoading, user, router, fetchProcedures]);

  if (isAuthLoading || user?.employee?.role?.access_level !== AccessLevel.admin) {
    return null;
  }
  
  const filteredProcedures = procedures.filter(procedure => 
    procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (procedure.code && procedure.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setIsDetailsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedProcedure(null);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Procedure>) => {
    try {
      if (selectedProcedure) {
        await ProcedureService.update(selectedProcedure.id, data);
      } else {
        await ProcedureService.create(data);
      }
      setIsFormModalOpen(false);
      fetchProcedures(true);
    } catch (error) {
      console.error("Failed to save procedure:", error);
      alert(i18n.t("common.error_saving"));
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(i18n.t("common.confirm_delete"))) {
      try {
        await ProcedureService.delete(id);
        fetchProcedures(true);
      } catch (error) {
        console.error("Failed to delete procedure:", error);
        alert(i18n.t("common.error_deleting"));
      }
    }
  };

  const gridColumns: GridColumn<Procedure>[] = [
    ...PROCEDURE_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: Procedure) => column.render!(item) : (column.name as keyof Procedure),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: i18n.t("common.actions"),
      align: "right",
      className: "actions-column",
      accessor: (procedure) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label={i18n.t("common.view_details")}
            onClick={() => handleViewDetails(procedure)}
          >
            <MdVisibility size={16} />
          </button>
          <button 
            className="edit-button" 
            aria-label={i18n.t("common.edit")}
            onClick={() => handleEdit(procedure)}
          >
            <MdEdit size={16} />
          </button>
          <button 
            className="delete-button" 
            aria-label={i18n.t("common.delete")}
            onClick={() => handleDelete(procedure.id)}
          >
            <MdDelete size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <GridPage
        title={i18n.t("pages.procedures.title")}
        description={i18n.t("pages.procedures.description")}
        data={filteredProcedures}
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
        isLoading={isLoading}
      />

      <ProcedureFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        procedure={selectedProcedure}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={i18n.t("pages.procedures.details_title")}
        data={selectedProcedure}
        columns={PROCEDURE_COLUMNS}
      />
    </>
  );
}
