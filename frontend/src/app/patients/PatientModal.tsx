"use client";

import { Modal } from "@/src/components/layout/Modal/Modal";
import { PatientModalProps } from "@/src/types/app/patients/PatientModal";
import { FormField, Input, Select } from "@/src/components/layout/Form/Form";
import "@/src/styles/components/layout/form.css";

export function PatientModal({ isOpen, onClose, onSubmit, patient }: PatientModalProps) {
  const isEdit = !!patient;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      birthDate: formData.get("birthDate") as string,
      gender: formData.get("gender") as string,
      room: formData.get("room") as string,
      status: formData.get("status") as string,
    };
    onSubmit(data);
  };

  const footer = (
    <>
      <button 
        type="button" 
        className="button-secondary" 
        onClick={onClose}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        form="patient-form"
        className="button-primary"
      >
        {isEdit ? "Save Changes" : "Create"}
      </button>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEdit ? "Edit Patient" : "New Patient"}
      footer={footer}
    >
      <form id="patient-form" className="form-content" onSubmit={handleSubmit}>
        <FormField label="Name" width="100">
          <Input 
            name="name" 
            defaultValue={patient?.name}
            required
            placeholder="Enter full name"
          />
        </FormField>

        <div className="form-row">
          <FormField label="Birth date" width="50">
            <Input 
              name="birthDate" 
              type="date"
              defaultValue={patient?.birthDate}
              required
            />
          </FormField>
          
          <FormField label="Gender" width="50">
            <Select 
              name="gender"
              defaultValue={patient?.gender || "Male"}
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" }
              ]}
            />
          </FormField>
        </div>

        <div className="form-row">
          <FormField label="Room" width="50">
            <Input 
              name="room"
              defaultValue={patient?.room !== "—" ? patient?.room : ""}
              placeholder="e.g. 204"
            />
          </FormField>
          
          <FormField label="Status" width="50">
            <Select 
              name="status"
              defaultValue={patient?.status || "Admitted"}
              options={[
                { label: "Admitted", value: "Admitted" },
                { label: "Observation", value: "Observation" },
                { label: "Discharged", value: "Discharged" }
              ]}
            />
          </FormField>
        </div>
      </form>
      <style jsx>{`
        .form-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }
      `}</style>
    </Modal>
  );
}
