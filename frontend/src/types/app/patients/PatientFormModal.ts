import { Patient } from "@/src/types/patient";

export interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Patient>) => void;
  patient?: Patient | null;
}
