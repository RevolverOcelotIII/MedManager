from sqlalchemy.orm import Session
from app.models.catalog import Medication
from app.schemas.medications import MedicationCreate, MedicationUpdate
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional

class MedicationService:
    @staticmethod
    def validate_duplicate(db_session: Session, trade_name: str, active_ingredient: str, dosage: str, exclude_medication_id: Optional[int] = None):
        validate_unique(
            db_session, 
            Medication, 
            {
                "trade_name": trade_name,
                "active_ingredient": active_ingredient,
                "dosage": dosage
            }, 
            exclude_id=exclude_medication_id, 
            error_message="Medication with this trade name, active ingredient and dosage already exists"
        )

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(Medication).all()

    @staticmethod
    def get_by_id(db_session: Session, medication_id: int):
        return get_object_or_404(db_session, Medication, medication_id)

    @staticmethod
    def create(db_session: Session, medication_data: MedicationCreate):
        MedicationService.validate_duplicate(
            db_session, 
            medication_data.trade_name, 
            medication_data.active_ingredient, 
            medication_data.dosage
        )
        
        new_medication = Medication(**medication_data.model_dump())
        db_session.add(new_medication)
        db_session.commit()
        db_session.refresh(new_medication)
        return new_medication

    @staticmethod
    def update(db_session: Session, medication_id: int, medication_data: MedicationUpdate):
        medication = MedicationService.get_by_id(db_session, medication_id)
        
        update_data = medication_data.model_dump(exclude_unset=True)
        
        duplicate_check_fields = ["trade_name", "active_ingredient", "dosage"]
        if any(field_name in update_data for field_name in duplicate_check_fields):
            new_trade_name = update_data.get("trade_name", medication.trade_name)
            new_active_ingredient = update_data.get("active_ingredient", medication.active_ingredient)
            new_dosage = update_data.get("dosage", medication.dosage)
            
            MedicationService.validate_duplicate(
                db_session, 
                new_trade_name, 
                new_active_ingredient, 
                new_dosage, 
                exclude_medication_id=medication_id
            )
            
        for field_name, field_value in update_data.items():
            setattr(medication, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(medication)
        return medication

    @staticmethod
    def delete(db_session: Session, medication_id: int):
        medication = MedicationService.get_by_id(db_session, medication_id)
        db_session.delete(medication)
        db_session.commit()
