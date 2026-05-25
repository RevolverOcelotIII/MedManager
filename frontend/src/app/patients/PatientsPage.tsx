"use client";

import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Patient, Sex, BloodType } from "@/src/types/patient";
import { PATIENT_COLUMNS } from "@/src/models/patient";
import { PatientFormModal } from "@/src/app/patients/PatientFormModal";
import "@/src/styles/app/patients.css";

const initialPatients: Patient[] = [
  { 
    id: 1, 
    full_name: "Anna Müller", 
    birth_date: "1984-03-12", 
    sex: Sex.MALE, 
    cpf: "123.456.789-01",
    phone: "(11) 98765-4321",
    blood_type: BloodType.O_P
  },
  { 
    id: 2, 
    full_name: "James O'Connor", 
    birth_date: "1971-09-02", 
    sex: Sex.MALE, 
    cpf: "987.654.321-09",
    phone: "(21) 91234-5678",
    blood_type: BloodType.A_P
  },
  { 
    id: 3, 
    full_name: "Sofia Almeida", 
    birth_date: "1995-06-21", 
    sex: Sex.FEMALE, 
    cpf: "456.789.123-45",
    phone: "(31) 99876-5432",
    blood_type: BloodType.AB_N
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  
  const filteredPatients = patients.filter(patient => 
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
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

  const gridColumns: GridColumn<Patient>[] = [
    ...PATIENT_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.name as keyof Patient,
      })),
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
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={handleNew}
      />

      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        patient={selectedPatient}
      />
    </>
  );
}
