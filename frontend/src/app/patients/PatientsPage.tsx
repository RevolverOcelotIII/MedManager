"use client";

import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Patient } from "@/src/types/patient";
import { PATIENT_COLUMNS } from "@/src/models/patient";
import { PatientFormModal } from "@/src/app/patients/PatientFormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { PatientService } from "@/src/services/patients";
import "@/src/styles/app/patients.css";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await PatientService.getAll();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  const filteredPatients = patients.filter(patient => 
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.cpf && patient.cpf.includes(searchTerm))
  );

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedPatient(null);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Patient>) => {
    try {
      if (selectedPatient) {
        await PatientService.update(selectedPatient.id, data);
      } else {
        await PatientService.create(data);
      }
      setIsFormModalOpen(false);
      fetchPatients(true);
    } catch (error) {
      console.error("Failed to save patient:", error);
      alert("Error saving patient. Please check the data and try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      try {
        await PatientService.delete(id);
        fetchPatients(true);
      } catch (error) {
        console.error("Failed to delete patient:", error);
        alert("Error deleting patient.");
      }
    }
  };

  const gridColumns: GridColumn<Patient>[] = [
    ...PATIENT_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: Patient) => column.render!(item) : (column.name as keyof Patient),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (patient) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label="View Details"
            onClick={() => handleViewDetails(patient)}
          >
            <MdVisibility size={16} />
          </button>
          <button 
            className="edit-button" 
            aria-label="Edit"
            onClick={() => handleEdit(patient)}
          >
            <MdEdit size={16} />
          </button>
          <button 
            className="delete-button" 
            aria-label="Delete"
            onClick={() => handleDelete(patient.id)}
          >
            <MdDelete size={16} />
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <>
      <GridPage
        title="Patients"
        description="People currently registered with the hospital."
        data={filteredPatients}
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
        isLoading={isLoading}
      />

      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        patient={selectedPatient}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Patient Details"
        data={selectedPatient}
        columns={PATIENT_COLUMNS}
      />
    </>
  );
}
