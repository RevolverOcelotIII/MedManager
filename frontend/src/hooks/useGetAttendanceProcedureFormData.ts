import { useState, useEffect, useMemo } from "react";
import { ProcedureService } from "@/src/services/procedures";
import { EmployeeService } from "@/src/services/employees";
import { MedicationService } from "@/src/services/medications";
import { Procedure } from "@/src/types/procedure";
import { Employee } from "@/src/types/employee";
import { Medication } from "@/src/types/medication";

export function useGetAttendanceProcedureFormData() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [procData, empData, medData] = await Promise.all([
          ProcedureService.getAll(),
          EmployeeService.getAll(),
          MedicationService.getAll()
        ]);
        setProcedures(procData);
        setEmployees(empData);
        setMedications(medData);
      } catch (error) {
        console.error("Failed to fetch attendance procedure form data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const procedureOptions = useMemo(() => 
    procedures.map(p => ({
      label: p.code ? `${p.code} - ${p.name}` : p.name,
      value: p.id
    })), 
    [procedures]
  );

  const employeeOptions = useMemo(() => 
    employees.map(e => ({
      label: e.full_name,
      value: e.id
    })), 
    [employees]
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
    employeeOptions,
    medicationOptions,
    isLoading
  };
}
