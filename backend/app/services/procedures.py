from sqlalchemy.orm import Session
from app.models.catalog import Procedure
from app.schemas.procedures import ProcedureCreate, ProcedureUpdate
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional

class ProcedureService:
    @staticmethod
    def validate_code_unique(db_session: Session, code: str, exclude_procedure_id: Optional[int] = None):
        if code:
            validate_unique(
                db_session, 
                Procedure, 
                {"code": code}, 
                exclude_id=exclude_procedure_id, 
                error_message="Procedure with this code already exists"
            )

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(Procedure).all()

    @staticmethod
    def get_by_id(db_session: Session, procedure_id: int):
        return get_object_or_404(db_session, Procedure, procedure_id)

    @staticmethod
    def create(db_session: Session, procedure_data: ProcedureCreate):
        ProcedureService.validate_code_unique(db_session, procedure_data.code)
        
        new_procedure = Procedure(**procedure_data.model_dump())
        db_session.add(new_procedure)
        db_session.commit()
        db_session.refresh(new_procedure)
        return new_procedure

    @staticmethod
    def update(db_session: Session, procedure_id: int, procedure_data: ProcedureUpdate):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        
        update_data = procedure_data.model_dump(exclude_unset=True)
        
        if "code" in update_data:
            ProcedureService.validate_code_unique(db_session, update_data["code"], exclude_procedure_id=procedure_id)
            
        for field_name, field_value in update_data.items():
            setattr(procedure, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(procedure)
        return procedure

    @staticmethod
    def delete(db_session: Session, procedure_id: int):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        db_session.delete(procedure)
        db_session.commit()
