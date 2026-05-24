from sqlalchemy.orm import Session
from app.models.catalog import Procedure
from app.schemas.procedures import ProcedureCreate, ProcedureUpdate
from fastapi import HTTPException
from typing import Optional

class ProcedureService:
    @staticmethod
    def validate_tuss_code_unique(db_session: Session, tuss_code: str, exclude_procedure_id: Optional[int] = None):
        if tuss_code:
            query = db_session.query(Procedure).filter(Procedure.tuss_code == tuss_code)
            if exclude_procedure_id:
                query = query.filter(Procedure.id != exclude_procedure_id)
            existing_procedure = query.first()
            if existing_procedure:
                raise HTTPException(status_code=400, detail="Procedure with this TUSS code already exists")

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(Procedure).all()

    @staticmethod
    def get_by_id(db_session: Session, procedure_id: int):
        procedure = db_session.query(Procedure).filter(Procedure.id == procedure_id).first()
        if not procedure:
            raise HTTPException(status_code=404, detail="Procedure not found")
        return procedure

    @staticmethod
    def create(db_session: Session, procedure_data: ProcedureCreate):
        ProcedureService.validate_tuss_code_unique(db_session, procedure_data.tuss_code)
        
        new_procedure = Procedure(**procedure_data.model_dump())
        db_session.add(new_procedure)
        db_session.commit()
        db_session.refresh(new_procedure)
        return new_procedure

    @staticmethod
    def update(db_session: Session, procedure_id: int, procedure_data: ProcedureUpdate):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        
        update_data = procedure_data.model_dump(exclude_unset=True)
        
        if "tuss_code" in update_data:
            ProcedureService.validate_tuss_code_unique(db_session, update_data["tuss_code"], exclude_procedure_id=procedure_id)
            
        for field_name, field_value in update_data.items():
            setattr(procedure, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(procedure)
        return procedure
