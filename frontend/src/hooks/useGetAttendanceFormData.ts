import { useState, useEffect, useMemo } from "react";
import { PatientService } from "@/src/services/patients";
import { Patient } from "@/src/types/patient";

export function useGetAttendanceFormData() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchAttendanceFormData() {
      setIsLoading(true);
      try {
        const patientData = await PatientService.getAll();
        setPatients(patientData);
      } catch (error) {
        console.error("Failed to fetch attendance form data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAttendanceFormData();
  }, []);

  const patientOptions = useMemo(() => 
    patients.map((patient) => ({
      label: `${patient.cpf} - ${patient.full_name}`,
      value: patient.id
    })), 
    [patients]
  );

  return {
    patientOptions,
    isLoading
  };
}
