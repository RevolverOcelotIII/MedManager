"use client";

import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Procedure } from "@/src/types/procedure";
import { PROCEDURE_COLUMNS } from "@/src/models/procedure";
import { ProcedureFormModal } from "@/src/app/procedures/ProcedureFormModal";
import { ProcedureService } from "@/src/services/procedures";
import "@/src/styles/app/patients.css";

export default function ProceduresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedProcedure(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Procedure>) => {
    try {
      if (selectedProcedure) {
        await ProcedureService.update(selectedProcedure.id, data);
      } else {
        await ProcedureService.create(data);
      }
      setIsModalOpen(false);
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
      .map(column => {
        if (column.name === "category") {
          return {
            header: column.label,
            accessor: (procedure: Procedure) => (
              <span className="category-badge">
                {procedure.category.charAt(0).toUpperCase() + procedure.category.slice(1)}
              </span>
            )
          };
        }
        return {
          header: column.label,
          accessor: column.name as keyof Procedure,
        };
      }),
    {
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (procedure) => (
        <div className="action-buttons">
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        procedure={selectedProcedure}
      />
    </>
  );
}
