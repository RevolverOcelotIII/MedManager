"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { MdEdit, MdDelete, MdVisibility } from "react-icons/md";
import { Grid } from "@/src/components/layout/Grid/Grid";
import { FormModal } from "@/src/components/layout/Form/FormModal";
import { DetailsModal } from "@/src/components/layout/Modal/DetailsModal";
import { AttendanceProcedure } from "@/src/types/attendance_procedure";
import { ATTENDANCE_PROCEDURE_COLUMNS } from "@/src/models/attendance_procedure";
import { AttendanceProcedureService } from "@/src/services/attendance_procedures";
import { useGetAttendanceProcedureFormData } from "@/src/hooks/useGetAttendanceProcedureFormData";
import { useAuth } from "@/src/hooks/useAuth";
import { AccessLevel } from "@/src/types/role";
import { GridColumn } from "@/src/types";
import { FormModalColumn } from "@/src/types/components/layout/Form/FormModal";
import { i18n } from "@/src/lib/i18n";

interface AttendanceProceduresModuleProps {
  attendanceId: number;
}

export function AttendanceProceduresModule({ attendanceId }: AttendanceProceduresModuleProps) {
  const { user } = useAuth();
  const accessLevel = user?.employee?.role?.access_level;

  const [attendanceProcedures, setAttendanceProcedures] = useState<AttendanceProcedure[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAttendanceProcedure, setSelectedAttendanceProcedure] = useState<AttendanceProcedure | null>(null);
  const [activeFormProcedureId, setActiveFormProcedureId] = useState<number | undefined>(undefined);

  const { 
    procedureOptions, 
    allEmployeeOptions, 
    qualifiedExecutorOptions, 
    medicationOptions 
  } = useGetAttendanceProcedureFormData(activeFormProcedureId);

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
    setActiveFormProcedureId(attendanceProcedure.procedure_id);
    setIsFormModalOpen(true);
  };

  const handleViewAttendanceProcedureDetails = (attendanceProcedure: AttendanceProcedure) => {
    setSelectedAttendanceProcedure(attendanceProcedure);
    setIsDetailsModalOpen(true);
  };

  const handleNewAttendanceProcedure = () => {
    setSelectedAttendanceProcedure(null);
    setActiveFormProcedureId(undefined);
    setIsFormModalOpen(true);
  };

  const handleFormChange = (data: any) => {
    // Ensure we parse the procedure_id if it's a string from a generic input
    const procId = data.procedure_id ? Number(data.procedure_id) : undefined;
    if (procId !== activeFormProcedureId) {
      setActiveFormProcedureId(procId);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const medicationIds = typeof formData.medications === 'string' 
        ? JSON.parse(formData.medications) 
        : formData.medications;

      let start_time = null;
      if (formData.start_date && formData.start_hour) {
        start_time = `${formData.start_date}T${formData.start_hour}:00`;
      }

      let end_time = null;
      if (formData.end_date && formData.end_hour) {
        end_time = `${formData.end_date}T${formData.end_hour}:00`;
      }

      const payload = {
        ...formData,
        attendance_id: attendanceId,
        medication_ids: medicationIds,
        start_time,
        end_time
      };
      
      // Remove virtual fields
      delete payload.medications;
      delete payload.start_date;
      delete payload.start_hour;
      delete payload.end_date;
      delete payload.end_hour;

      if (selectedAttendanceProcedure) {
        await AttendanceProcedureService.update(selectedAttendanceProcedure.id, payload);
      } else {
        await AttendanceProcedureService.create(payload);
      }
      setIsFormModalOpen(false);
      fetchAttendanceProcedures();
    } catch (error) {
      console.error("Failed to save attendance procedure:", error);
      alert(i18n.t("common.error_saving"));
    }
  };

  const handleDeleteAttendanceProcedure = async (id: number) => {
    if (confirm(i18n.t("common.confirm_delete"))) {
      try {
        await AttendanceProcedureService.delete(id);
        fetchAttendanceProcedures();
      } catch (error) {
        console.error("Failed to delete procedure record:", error);
      }
    }
  };

  const canCreate = accessLevel !== AccessLevel.pharmaceutical;
  const canEdit = accessLevel !== AccessLevel.pharmaceutical;
  const canDelete = accessLevel === AccessLevel.admin;

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
      header: i18n.t("common.actions"),
      align: "right",
      accessor: (item) => (
        <div className="action-buttons">
          <button 
            className="view-button" 
            aria-label={i18n.t("common.view_details")}
            onClick={() => handleViewAttendanceProcedureDetails(item)}
          >
            <MdVisibility size={16} />
          </button>
          
          {canEdit && (
            <button 
              className="edit-button" 
              aria-label={i18n.t("common.edit")}
              onClick={() => handleEditAttendanceProcedure(item)}
            >
              <MdEdit size={16} />
            </button>
          )}

          {canDelete && (
            <button 
              className="delete-button" 
              aria-label={i18n.t("common.delete")}
              onClick={() => handleDeleteAttendanceProcedure(item.id)}
            >
              <MdDelete size={16} />
            </button>
          )}
        </div>
      ),
    }
  ];

  const formColumns: FormModalColumn[] = ATTENDANCE_PROCEDURE_COLUMNS
    .filter(column => column.form)
    .map(column => {
      let options = column.options;
      let disabled = column.disabled;

      if (column.name === "procedure_id") options = procedureOptions;
      if (column.name === "ordered_by_id") options = allEmployeeOptions;
      if (column.name === "executed_by_id") options = qualifiedExecutorOptions;
      if (column.name === "medications") options = medicationOptions;

      // Business Rule: executed_by_id is disabled until a procedure is selected
      if (column.name === "executed_by_id" && !activeFormProcedureId) {
        disabled = true;
      }

      return {
        name: column.name,
        label: column.label,
        type: column.type as any,
        width: column.width,
        required: column.required,
        placeholder: column.placeholder,
        disabled: disabled,
        readOnly: column.readOnly,
        options: options,
      } as FormModalColumn;
    });

  const initialFormData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!selectedAttendanceProcedure) {
      return {
        ordered_by_id: user?.employee_id,
        start_date: today,
        end_date: today,
      };
    }

    // Split existing times into date and hour for the form
    let start_date = today;
    let start_hour = "";
    if (selectedAttendanceProcedure.start_time) {
      const dt = new Date(selectedAttendanceProcedure.start_time);
      start_date = dt.toISOString().split('T')[0];
      start_hour = dt.toTimeString().split(' ')[0].substring(0, 5);
    }

    let end_date = today;
    let end_hour = "";
    if (selectedAttendanceProcedure.end_time) {
      const dt = new Date(selectedAttendanceProcedure.end_time);
      end_date = dt.toISOString().split('T')[0];
      end_hour = dt.toTimeString().split(' ')[0].substring(0, 5);
    }

    return {
      ...selectedAttendanceProcedure,
      medications: selectedAttendanceProcedure.medications?.map(m => m.id) || [],
      start_date,
      start_hour,
      end_date,
      end_hour
    };
  }, [selectedAttendanceProcedure, user, isFormModalOpen]);

  return (
    <div className="attendance-procedures-module">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="details-section-title">{i18n.t("sidebar.procedures")}</h3>
        {canCreate && (
          <button className="button-primary" onClick={handleNewAttendanceProcedure}>
            {i18n.t("common.new")}
          </button>
        )}
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
        onChange={handleFormChange}
        title={selectedAttendanceProcedure ? i18n.t("pages.attendance_procedure.edit_title") : i18n.t("pages.attendance_procedure.new_title")}
        columns={formColumns}
        initialData={initialFormData}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={i18n.t("pages.attendance_procedure.details_title")}
        data={selectedAttendanceProcedure}
        columns={ATTENDANCE_PROCEDURE_COLUMNS}
      />
    </div>
  );
}
