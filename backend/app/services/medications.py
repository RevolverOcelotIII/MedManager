from sqlalchemy.orm import Session
from app.models.catalog import Medication
from app.schemas.medications import MedicationCreate, MedicationUpdate, MedicationResponse
from app.services.utils import get_object_or_404, validate_unique
from app.core.redis import get_cache, set_cache, invalidate_cache
from typing import Optional

CACHE_KEY = "cache:medications:all"

class MedicationService:
    @staticmethod
    def validate_name_unique(db_session: Session, trade_name: str, exclude_med_id: Optional[int] = None):
        validate_unique(
            db_session, 
            Medication, 
            {"trade_name": trade_name}, 
            exclude_id=exclude_med_id, 
            error_message="Medication trade name already registered"
        )

    @staticmethod
    def get_all(db_session: Session):
        cached = get_cache(CACHE_KEY)
        if cached:
            return cached
            
        meds = db_session.query(Medication).all()
        med_dicts = [MedicationResponse.model_validate(m).model_dump(mode="json") for m in meds]
        set_cache(CACHE_KEY, med_dicts)
        return meds

    @staticmethod
    def get_by_id(db_session: Session, medication_id: int):
        return get_object_or_404(db_session, Medication, medication_id)

    @staticmethod
    def create(db_session: Session, medication_data: MedicationCreate):
        MedicationService.validate_name_unique(db_session, medication_data.trade_name)
        
        new_medication = Medication(**medication_data.model_dump())
        db_session.add(new_medication)
        db_session.commit()
        db_session.refresh(new_medication)
        
        invalidate_cache(CACHE_KEY)
        return new_medication

    @staticmethod
    def update(db_session: Session, medication_id: int, medication_data: MedicationUpdate):
        medication = MedicationService.get_by_id(db_session, medication_id)
        
        update_data = medication_data.model_dump(exclude_unset=True)
        
        if "trade_name" in update_data:
            MedicationService.validate_name_unique(db_session, update_data["trade_name"], exclude_med_id=medication_id)
            
        for field_name, field_value in update_data.items():
            setattr(medication, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(medication)
        
        invalidate_cache(CACHE_KEY)
        return medication

    @staticmethod
    def delete(db_session: Session, medication_id: int):
        medication = MedicationService.get_by_id(db_session, medication_id)
        db_session.delete(medication)
        db_session.commit()
        
        invalidate_cache(CACHE_KEY)
