from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.medical_record import MedicalRecord, RecordType
from app.models.patient import Patient
from app.models.user import User
from app.models.catalog import Medication, Procedure
from app.schemas.medical_records import MedicalRecordCreate, MedicalRecordUpdate
from app.services.utils import get_object_or_404

class MedicalRecordService:
    @staticmethod
    def validate_patient_exists(db_session: Session, patient_id: int):
        get_object_or_404(db_session, Patient, patient_id)

    @staticmethod
    def validate_user_exists(db_session: Session, user_id: int):
        get_object_or_404(db_session, User, user_id)

    @staticmethod
    def validate_medication_exists(db_session: Session, medication_id: int):
        if medication_id:
            get_object_or_404(db_session, Medication, medication_id)

    @staticmethod
    def validate_procedure_exists(db_session: Session, procedure_id: int):
        if procedure_id:
            get_object_or_404(db_session, Procedure, procedure_id)

    @staticmethod
    def validate_record_consistency(db_session: Session, record_data: MedicalRecordCreate):
        if record_data.category == RecordType.MEDICATION:
            if not record_data.medication_id:
                raise HTTPException(status_code=400, error_message="Medication ID is required for medication records")
            MedicalRecordService.validate_medication_exists(db_session, record_data.medication_id)
        elif record_data.category == RecordType.PROCEDURE:
            if not record_data.procedure_id:
                raise HTTPException(status_code=400, error_message="Procedure ID is required for procedure records")
            MedicalRecordService.validate_procedure_exists(db_session, record_data.procedure_id)

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(MedicalRecord).all()

    @staticmethod
    def get_by_id(db_session: Session, record_id: int):
        return get_object_or_404(db_session, MedicalRecord, record_id, error_message="Medical record not found")

    @staticmethod
    def create(db_session: Session, record_data: MedicalRecordCreate, current_user_id: int):
        MedicalRecordService.validate_patient_exists(db_session, record_data.patient_id)
        MedicalRecordService.validate_user_exists(db_session, current_user_id)
        MedicalRecordService.validate_record_consistency(db_session, record_data)
        
        new_record = MedicalRecord(
            **record_data.model_dump(),
            user_id=current_user_id
        )
        db_session.add(new_record)
        db_session.commit()
        db_session.refresh(new_record)
        return new_record

    @staticmethod
    def update(db_session: Session, record_id: int, record_data: MedicalRecordUpdate):
        record = MedicalRecordService.get_by_id(db_session, record_id)
        
        update_data = record_data.model_dump(exclude_unset=True)
        
        for field_name, field_value in update_data.items():
            setattr(record, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(record)
        return record

    @staticmethod
    def delete(db_session: Session, record_id: int):
        record = MedicalRecordService.get_by_id(db_session, record_id)
        db_session.delete(record)
        db_session.commit()
