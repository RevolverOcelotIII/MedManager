"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { Grid } from "@/src/components/layout/Grid/Grid";
import { FormModal } from "@/src/components/layout/Form/FormModal";
import { AttendanceProcedure } from "@/src/types/attendance_procedure";
import { ATTENDANCE_PROCEDURE_COLUMNS } from "@/src/models/attendance_procedure";
import { AttendanceProcedureService } from "@/src/services/attendance_procedures";
import { useGetAttendanceProcedureFormData } from "@/src/hooks/useGetAttendanceProcedureFormData";
import { GridColumn } from "@/src/types";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";

interface AttendanceProceduresModuleProps {
  attendanceId: number;
}

export function AttendanceProceduresModule({ attendanceId }: AttendanceProceduresModuleProps) {
  const [attendanceProcedures, setAttendanceProcedures] = useState<AttendanceProcedure[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAttendanceProcedure, setSelectedAttendanceProcedure] = useState<AttendanceProcedure | null>(null);

  const { procedureOptions, employeeOptions, medicationOptions } = useGetAttendanceProcedureFormData();

  const fetchAttendanceProcedures = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const data = await AttendanceProcedureService.getByAttendance(attendanceId);
      setAttendanceProcedures(data);
    } catch (error) {
      console.error("Failed to fetch attendance procedures:", error);
    } finally {
      setIsDataLoading(false);
    }
  }, [attendanceId]);

  useEffect(() => {
    fetchAttendanceProcedures();
  }, [fetchAttendanceProcedures]);

  const handleEditAttendanceProcedure = (attendanceProcedure: AttendanceProcedure) => {
    setSelectedAttendanceProcedure(attendanceProcedure);
    setIsFormModalOpen(true);
  };

  const handleNewAttendanceProcedure = () => {
    setSelectedAttendanceProcedure(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const medicationIds = typeof formData.medications === 'string' 
        ? JSON.parse(formData.medications) 
        : formData.medications;

      const payload = {
        ...formData,
        attendance_id: attendanceId,
        medication_ids: medicationIds
      };
      
      delete payload.medications;

      if (selectedAttendanceProcedure) {
        await AttendanceProcedureService.update(selectedAttendanceProcedure.id, payload);
      } else {
        await AttendanceProcedureService.create(payload);
      }
      setIsFormModalOpen(false);
      fetchAttendanceProcedures();
    } catch (error) {
      console.error("Failed to save attendance procedure:", error);
      alert("Error saving procedure execution record.");
    }
  };

  const handleDeleteAttendanceProcedure = async (id: number) => {
    if (confirm("Are you sure you want to delete this procedure record?")) {
      try {
        await AttendanceProcedureService.delete(id);
        fetchAttendanceProcedures();
      } catch (error) {
        console.error("Failed to delete procedure record:", error);
      }
    }
  };

  const gridColumns: GridColumn<AttendanceProcedure>[] = [
    ...ATTENDANCE_PROCEDURE_COLUMNS
      .filter(column => column.grid)
      .map(column => ({
        header: column.label,
        accessor: column.render ? (item: AttendanceProcedure) => column.render!(item) : (column.name as keyof AttendanceProcedure),
        badge: column.badge,
        options: column.options,
      })),
    {
      header: "Actions",
      align: "right",
      accessor: (item) => (
        <div className="action-buttons">
          <button className="edit-button" onClick={() => handleEditAttendanceProcedure(item)}><MdEdit size={16} /></button>
          <button className="delete-button" onClick={() => handleDeleteAttendanceProcedure(item.id)}><MdDelete size={16} /></button>
        </div>
      ),
    }
  ];

  const formColumns: FormModalColumn[] = ATTENDANCE_PROCEDURE_COLUMNS
    .filter(column => column.form)
    .map(column => {
      let options = column.options;
      if (column.name === "procedure_id") options = procedureOptions;
      if (column.name === "ordered_by_id" || column.name === "executed_by_id") options = employeeOptions;
      if (column.name === "medications") options = medicationOptions;

      return {
        name: column.name,
        label: column.label,
        type: column.type as any,
        width: column.width,
        required: column.required,
        placeholder: column.placeholder,
        options: options,
      };
    });

  const initialFormData = useMemo(() => {
    if (!selectedAttendanceProcedure) return {};
    return {
      ...selectedAttendanceProcedure,
      medications: selectedAttendanceProcedure.medications.map(m => m.id)
    };
  }, [selectedAttendanceProcedure]);

  return (
    <div className="attendance-procedures-module">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="details-section-title">Executed Procedures</h3>
        <button className="button-primary" onClick={handleNewAttendanceProcedure}>Add Procedure</button>
      </div>
      
      <div className="module-grid">
        <Grid
          data={attendanceProcedures}
          columns={gridColumns}
          rowKey="id"
          isLoading={isDataLoading}
        />
      </div>

      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        title={selectedAttendanceProcedure ? "Edit Procedure Record" : "Add Procedure Record"}
        columns={formColumns}
        initialData={initialFormData}
      />
    </div>
  );
}
