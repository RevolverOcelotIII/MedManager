"use client";

import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import "@/src/styles/app/patients.css";

interface Patient {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
  room: string;
  status: string;
}

const initialPatients: Patient[] = [
  { id: 1, name: "Anna Müller", birthDate: "1984-03-12", gender: "F", room: "204", status: "Admitted" },
  { id: 2, name: "James O'Connor", birthDate: "1971-09-02", gender: "M", room: "112", status: "Observation" },
  { id: 3, name: "Sofia Almeida", birthDate: "1995-06-21", gender: "F", room: "—", status: "Discharged" },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = initialPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      accessor: () => (
        <div className="action-buttons">
          <button className="edit-button" aria-label="Edit">
            <MdEdit size={16} />
          </button>
          <button className="delete-button" aria-label="Delete">
            <MdDelete size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <GridPage
      title="Patients"
      description="People currently registered with the hospital."
      data={filteredPatients}
      columns={patientColumns}
      rowKey="id"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      onNewClick={() => console.log("Create new patient")}
    />
  );
}
