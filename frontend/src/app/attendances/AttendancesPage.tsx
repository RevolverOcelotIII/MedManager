"use client";

import { useState, useEffect, useCallback } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { GridPage } from "@/src/components/layout/GridPage/GridPage";
import { GridColumn } from "@/src/types";
import { Attendance } from "@/src/types/attendance";
import { ATTENDANCE_COLUMNS } from "@/src/models/attendance";
import { AttendanceFormModal } from "@/src/app/attendances/AttendanceFormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { AttendanceProceduresModule } from "@/src/app/attendances/AttendanceProceduresModule";
import { AttendanceService } from "@/src/services/attendances";
import { useAuth } from "@/src/hooks/useAuth";
import { AccessLevel } from "@/src/types/role";
import "@/src/styles/app/patients.css";

export default function AttendancesPage() {
  const { user } = useAuth();
  const accessLevel = user?.employee?.role?.access_level;

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttendances = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await AttendanceService.getAll();
      setAttendances(data);
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);
  
  const filteredAttendances = attendances.filter(attendance => {
    const search = searchTerm.toLowerCase();
    const patientName = attendance.patient?.full_name?.toLowerCase() || "";
    const patientCpf = attendance.patient?.cpf?.toLowerCase() || "";
    const gravity = attendance.gravity.toLowerCase();
    
    return patientName.includes(search) || 
           patientCpf.includes(search) || 
           gravity.includes(search) ||
           attendance.patient_id.toString().includes(search);
  });

  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsDetailsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedAttendance(null);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Attendance>) => {
    try {
      if (selectedAttendance) {
        await AttendanceService.update(selectedAttendance.id, data);
      } else {
        await AttendanceService.create(data);
      }
      setIsFormModalOpen(false);
      fetchAttendances(true);
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Error saving attendance. Please check the data and try again.");
    }
  };

  const canModifyHeader = accessLevel === AccessLevel.admin || accessLevel === AccessLevel.attendant;

  const gridColumns: GridColumn<Attendance>[] = [
    ...ATTENDANCE_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: Attendance) => column.render!(item) : (column.name as keyof Attendance),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: "Actions",
      align: "right",
      className: "actions-column",
      accessor: (attendance) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label="View Details"
            onClick={() => handleViewDetails(attendance)}
          >
            <MdVisibility size={16} />
          </button>
          
          {canModifyHeader && (
            <button 
              className="edit-button" 
              aria-label="Edit"
              onClick={() => handleEdit(attendance)}
            >
              <MdEdit size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <GridPage
        title="Attendances"
        description="Patient visits and clinical workflow."
        data={filteredAttendances}
        columns={gridColumns}
        rowKey="id"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClick={canModifyHeader ? handleNew : undefined}
        isLoading={isLoading}
      />

      <AttendanceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
        attendance={selectedAttendance}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Attendance Details"
        data={selectedAttendance}
        columns={ATTENDANCE_COLUMNS}
        customContent={selectedAttendance && (
          <AttendanceProceduresModule attendanceId={selectedAttendance.id} />
        )}
      />
    </>
  );
}
