import { Patient } from "@/src/types/app/patients/PatientsPage";

export interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Patient>) => void;
  patient?: Patient | null;
}
