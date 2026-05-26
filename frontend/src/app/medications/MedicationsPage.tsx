"use client";

import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Medication } from "@/src/types/medication";
import { MEDICATION_COLUMNS } from "@/src/models/medication";
import { MedicationFormModal } from "@/src/app/medications/MedicationFormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { MedicationService } from "@/src/services/medications";
import "@/src/styles/app/patients.css";

export default function MedicationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedications = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await MedicationService.getAll();
      setMedications(data);
    } catch (error) {
      console.error("Failed to fetch medications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);
  
  const filteredMedications = medications.filter(medication => 
    medication.trade_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.active_ingredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDetailsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedMedication(null);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Medication>) => {
    try {
      if (selectedMedication) {
        await MedicationService.update(selectedMedication.id, data);
      } else {
        await MedicationService.create(data);
      }
      setIsFormModalOpen(false);
      fetchMedications(true);
    } catch (error) {
      console.error("Failed to save medication:", error);
      alert("Error saving medication. Please check the data and try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      try {
        await MedicationService.delete(id);
        fetchMedications(true);
      } catch (error) {
        console.error("Failed to delete medication:", error);
        alert("Error deleting medication.");
      }
    }
  };

  const gridColumns: GridColumn<Medication>[] = [
    ...MEDICATION_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: Medication) => column.render!(item) : (column.name as keyof Medication),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (medication) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label="View Details"
            onClick={() => handleViewDetails(medication)}
          >
            <MdVisibility size={16} />
          </button>
          <button 
            className="edit-button" 
            aria-label="Edit"
            onClick={() => handleEdit(medication)}
          >
            <MdEdit size={16} />
          </button>
          <button 
            className="delete-button" 
            aria-label="Delete"
            onClick={() => handleDelete(medication.id)}
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
        title="Medications"
        description="Manage the medicine catalog and stock."
        data={filteredMedications}
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
        isLoading={isLoading}
      />

      <MedicationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        medication={selectedMedication}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Medication Details"
        data={selectedMedication}
        columns={MEDICATION_COLUMNS}
      />
    </>
  );
}
