from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.models.attendance import Attendance
from app.models.attendance_procedure import AttendanceProcedure
from app.schemas.patients import PatientCreate, PatientUpdate, PatientResponse
from app.services.utils import get_object_or_404, validate_unique
from app.core.redis import get_cache, set_cache, invalidate_cache
from typing import Optional, List

CACHE_PREFIX = "cache:patients"

class PatientService:
    @staticmethod
    def get_all(db_session: Session, med_employee_id: Optional[int] = None):
        cache_key = f"{CACHE_PREFIX}:all" if not med_employee_id else f"{CACHE_PREFIX}:med:{med_employee_id}"
        
        cached = get_cache(cache_key)
        if cached:
            return cached
            
        query = db_session.query(Patient)
        
        if med_employee_id:
            # Filter patients that have at least one attendance procedure executed by this professional
            query = query.join(Attendance).join(AttendanceProcedure)\
                         .filter(AttendanceProcedure.executed_by_id == med_employee_id)\
                         .distinct()
            
        patients = query.all()
        patient_dicts = [PatientResponse.model_validate(p).model_dump(mode="json") for p in patients]
        set_cache(cache_key, patient_dicts)
        return patients

    @staticmethod
    def get_by_id(db_session: Session, patient_id: int, med_employee_id: Optional[int] = None):
        # Implementation could verify med_employee_id association here if needed
        return get_object_or_404(db_session, Patient, patient_id)

    @staticmethod
    def create(db_session: Session, patient_data: PatientCreate):
        PatientService.validate_cpf_unique(db_session, patient_data.cpf)
        
        new_patient = Patient(**patient_data.model_dump())
        db_session.add(new_patient)
        db_session.commit()
        db_session.refresh(new_patient)
        
        invalidate_cache(f"{CACHE_PREFIX}:*")
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
        
        invalidate_cache(f"{CACHE_PREFIX}:*")
        return patient

    @staticmethod
    def delete(db_session: Session, patient_id: int):
        patient = PatientService.get_by_id(db_session, patient_id)
        db_session.delete(patient)
        db_session.commit()
        
        invalidate_cache(f"{CACHE_PREFIX}:*")

    @staticmethod
    def validate_cpf_unique(db_session: Session, cpf: str, exclude_patient_id: Optional[int] = None):
        validate_unique(
            db_session, 
            Patient, 
            {"cpf": cpf}, 
            exclude_id=exclude_patient_id, 
            error_message="CPF already registered"
        )
