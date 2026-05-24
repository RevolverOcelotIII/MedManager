from sqlalchemy.orm import Session
from app.models.medical_record import MedicalRecord, RecordType
from app.models.patient import Patient
from app.models.user import User
from app.models.catalog import Medication, Procedure
from app.schemas.records import MedicalRecordCreate, MedicalRecordUpdate
from fastapi import HTTPException

class MedicalRecordService:
    @staticmethod
    def validate_patient_exists(db_session: Session, patient_id: int):
        patient = db_session.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

    @staticmethod
    def validate_user_exists(db_session: Session, user_id: int):
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

    @staticmethod
    def validate_medication_exists(db_session: Session, medication_id: int):
        if medication_id:
            medication = db_session.query(Medication).filter(Medication.id == medication_id).first()
            if not medication:
                raise HTTPException(status_code=404, detail="Medication not found")

    @staticmethod
    def validate_procedure_exists(db_session: Session, procedure_id: int):
        if procedure_id:
            procedure = db_session.query(Procedure).filter(Procedure.id == procedure_id).first()
            if not procedure:
                raise HTTPException(status_code=404, detail="Procedure not found")

    @staticmethod
    def validate_record_consistency(db_session: Session, record_data: MedicalRecordCreate):
        if record_data.category == RecordType.MEDICATION:
            if not record_data.medication_id:
                raise HTTPException(status_code=400, detail="Medication ID is required for medication records")
            MedicalRecordService.validate_medication_exists(db_session, record_data.medication_id)
        elif record_data.category == RecordType.PROCEDURE:
            if not record_data.procedure_id:
                raise HTTPException(status_code=400, detail="Procedure ID is required for procedure records")
            MedicalRecordService.validate_procedure_exists(db_session, record_data.procedure_id)

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(MedicalRecord).all()

    @staticmethod
    def get_by_id(db_session: Session, record_id: int):
        record = db_session.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Medical record not found")
        return record

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
