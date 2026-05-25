from sqlalchemy.orm import Session
from app.models.prescription import Prescription
from app.schemas.prescriptions import PrescriptionCreate, PrescriptionUpdate
from app.services.utils import get_object_or_404
from typing import Optional

class PrescriptionService:
    @staticmethod
    def get_all_by_attendance(db_session: Session, attendance_id: int):
        return db_session.query(Prescription).filter(Prescription.attendance_id == attendance_id).all()

    @staticmethod
    def get_by_id(db_session: Session, prescription_id: int):
        return get_object_or_404(db_session, Prescription, prescription_id)

    @staticmethod
    def create(db_session: Session, prescription_data: PrescriptionCreate):
        new_prescription = Prescription(**prescription_data.model_dump())
        db_session.add(new_prescription)
        db_session.commit()
        db_session.refresh(new_prescription)
        return new_prescription

    @staticmethod
    def update(db_session: Session, prescription_id: int, prescription_data: PrescriptionUpdate):
        prescription = PrescriptionService.get_by_id(db_session, prescription_id)
        update_data = prescription_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(prescription, field, value)
            
        db_session.commit()
        db_session.refresh(prescription)
        return prescription

    @staticmethod
    def delete(db_session: Session, prescription_id: int):
        prescription = PrescriptionService.get_by_id(db_session, prescription_id)
        db_session.delete(prescription)
        db_session.commit()
