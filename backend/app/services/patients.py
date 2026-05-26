from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.models.attendance import Attendance
from app.models.attendance_procedure import AttendanceProcedure
from app.schemas.patients import PatientCreate, PatientUpdate
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional

class PatientService:
    @staticmethod
    def validate_cpf_unique(db_session: Session, cpf: str, exclude_patient_id: Optional[int] = None):
        validate_unique(
            db_session, 
            Patient, 
            {"cpf": cpf}, 
            exclude_id=exclude_patient_id, 
            error_message="CPF already registered"
        )

    @staticmethod
    def get_all(db_session: Session, med_employee_id: Optional[int] = None):
        query = db_session.query(Patient)
        if med_employee_id:
            query = query.join(Attendance).join(AttendanceProcedure).filter(AttendanceProcedure.executed_by_id == med_employee_id).distinct()
        return query.all()

    @staticmethod
    def get_by_id(db_session: Session, patient_id: int, med_employee_id: Optional[int] = None):
        query = db_session.query(Patient).filter(Patient.id == patient_id)
        if med_employee_id:
            query = query.join(Attendance).join(AttendanceProcedure).filter(AttendanceProcedure.executed_by_id == med_employee_id)
            patient = query.first()
            if not patient:
                from fastapi import HTTPException
                raise HTTPException(status_code=404, detail="Patient not found or not allocated to you.")
            return patient
        return get_object_or_404(db_session, Patient, patient_id)

    @staticmethod
    def create(db_session: Session, patient_data: PatientCreate):
        PatientService.validate_cpf_unique(db_session, patient_data.cpf)
        
        new_patient = Patient(**patient_data.model_dump())
        db_session.add(new_patient)
        db_session.commit()
        db_session.refresh(new_patient)
        return new_patient

    @staticmethod
    def update(db_session: Session, patient_id: int, patient_data: PatientUpdate):
        patient = PatientService.get_by_id(db_session, patient_id)
        
        update_data = patient_data.model_dump(exclude_unset=True)
        
        if "cpf" in update_data:
            PatientService.validate_cpf_unique(db_session, update_data["cpf"], exclude_patient_id=patient_id)
            
        for field_name, field_value in update_data.items():
            setattr(patient, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(patient)
        return patient

    @staticmethod
    def delete(db_session: Session, patient_id: int):
        patient = PatientService.get_by_id(db_session, patient_id)
        db_session.delete(patient)
        db_session.commit()
