from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.schemas.patients import PatientCreate, PatientUpdate
from fastapi import HTTPException
from typing import Optional

class PatientService:
    @staticmethod
    def validate_cpf_unique(db_session: Session, cpf: str, exclude_patient_id: Optional[int] = None):
        query = db_session.query(Patient).filter(Patient.cpf == cpf)
        if exclude_patient_id:
            query = query.filter(Patient.id != exclude_patient_id)
        existing_patient = query.first()
        if existing_patient:
            raise HTTPException(status_code=400, detail="CPF already registered")

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(Patient).all()

    @staticmethod
    def get_by_id(db_session: Session, patient_id: int):
        patient = db_session.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient

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
