import { useState, useEffect, useMemo } from "react";
import { ProcedureService } from "@/src/services/procedures";
import { EmployeeService } from "@/src/services/employees";
import { MedicationService } from "@/src/services/medications";
import { Procedure } from "@/src/types/procedure";
import { Employee } from "@/src/types/employee";
import { Medication } from "@/src/types/medication";

export function useGetAttendanceProcedureFormData(procedureId?: number) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [qualifiedExecutors, setQualifiedExecutors] = useState<Employee[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [procData, allEmpData, medData] = await Promise.all([
          ProcedureService.getAll(),
          EmployeeService.getAll(),
          MedicationService.getAll()
        ]);
        setProcedures(procData);
        setAllEmployees(allEmpData);
        setMedications(medData);
      } catch (error) {
        console.error("Failed to fetch general attendance procedure form data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Separate effect to fetch qualified executors when procedureId changes
  useEffect(() => {
    async function fetchExecutors() {
      if (!procedureId) {
        setQualifiedExecutors([]);
        return;
      }
      
      try {
        const executors = await EmployeeService.getAll(procedureId);
        setQualifiedExecutors(executors);
      } catch (error) {
        console.error("Failed to fetch qualified executors:", error);
      }
    }

    fetchExecutors();
  }, [procedureId]);

  const procedureOptions = useMemo(() => 
    procedures.map(p => ({
      label: p.code ? `${p.code} - ${p.name}` : p.name,
      value: p.id
    })), 
    [procedures]
  );

  const allEmployeeOptions = useMemo(() => 
    allEmployees.map(e => ({
      label: e.full_name,
      value: e.id
    })), 
    [allEmployees]
  );

  const qualifiedExecutorOptions = useMemo(() => 
    qualifiedExecutors.map(e => ({
      label: e.full_name,
      value: e.id
    })), 
    [qualifiedExecutors]
  );

  const medicationOptions = useMemo(() => 
    medications.map(m => ({
      label: `${m.trade_name} (${m.active_ingredient})`,
      value: m.id
    })), 
    [medications]
  );

  return {
    procedureOptions,
    allEmployeeOptions,
    qualifiedExecutorOptions,
    medicationOptions,
    isLoading
  };
}
