"use client";

import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Procedure } from "@/src/types/procedure";
import { PROCEDURE_COLUMNS } from "@/src/models/procedure";
import { ProcedureFormModal } from "@/src/app/procedures/ProcedureFormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { ProcedureService } from "@/src/services/procedures";
import "@/src/styles/app/patients.css";

export default function ProceduresPage() {
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
    fetchProcedures();
  }, [fetchProcedures]);
  
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
      alert("Error saving procedure. Please check the data and try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this procedure?")) {
      try {
        await ProcedureService.delete(id);
        fetchProcedures(true);
      } catch (error) {
        console.error("Failed to delete procedure:", error);
        alert("Error deleting procedure.");
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
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (procedure) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label="View Details"
            onClick={() => handleViewDetails(procedure)}
          >
            <MdVisibility size={16} />
          </button>
          <button 
            className="edit-button" 
            aria-label="Edit"
            onClick={() => handleEdit(procedure)}
          >
            <MdEdit size={16} />
          </button>
          <button 
            className="delete-button" 
            aria-label="Delete"
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
        title="Procedures"
        description="Medical procedures, exams, and clinical actions."
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
        title="Procedure Details"
        data={selectedProcedure}
        columns={PROCEDURE_COLUMNS}
      />
    </>
  );
}
