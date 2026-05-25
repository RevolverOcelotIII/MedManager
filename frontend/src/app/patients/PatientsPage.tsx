"use client";

import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Patient } from "@/src/types/app/patients/PatientsPage";
import { PatientModal } from "@/src/app/patients/PatientModal";
import "@/src/styles/app/patients.css";

const initialPatients: Patient[] = [
  { id: 1, name: "Anna Müller", birthDate: "1984-03-12", gender: "F", room: "204", status: "Admitted" },
  { id: 2, name: "James O'Connor", birthDate: "1971-09-02", gender: "M", room: "112", status: "Observation" },
  { id: 3, name: "Sofia Almeida", birthDate: "1995-06-21", gender: "F", room: "—", status: "Discharged" },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Partial<Patient>) => {
    if (selectedPatient) {
      setPatients(prev => prev.map(p => 
        p.id === selectedPatient.id ? { ...p, ...data } as Patient : p
      ));
    } else {
      const newPatient: Patient = {
        ...data,
        id: Math.max(...patients.map(p => p.id), 0) + 1,
      } as Patient;
      setPatients(prev => [...prev, newPatient]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      setPatients(prev => prev.filter(p => p.id !== id));
    }
  };

  const patientColumns: GridColumn<Patient>[] = [
    { header: "Name", accessor: "name"},
    { header: "Birth date", accessor: "birthDate"},
    { header: "Gender", accessor: "gender" },
    { header: "Room", accessor: "room"},
    { 
      header: "Status", 
      accessor: (patient) => {
        const statusType = patient.status.toLowerCase();
        return (
          <span className={`status-badge status-${statusType}`}>
            {patient.status}
          </span>
        );
      } 
    },
    {
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (patient) => (
        <div className="action-buttons">
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

  return (
    <>
      <GridPage
        title="Patients"
        description="People currently registered with the hospital."
        data={filteredPatients}
        columns={patientColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
      />

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        patient={selectedPatient}
      />
    </>
  );
}
