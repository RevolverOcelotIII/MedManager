from sqlalchemy.orm import Session
from app.models.catalog import Procedure
from app.models.employee import Role
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
        
        data = procedure_data.model_dump()
        responsible_role_ids = data.pop("responsible_role_ids", [])
        
        new_procedure = Procedure(**data)
        
        if responsible_role_ids:
            roles = db_session.query(Role).filter(Role.id.in_(responsible_role_ids)).all()
            new_procedure.responsible_roles = roles
            
        db_session.add(new_procedure)
        db_session.commit()
        db_session.refresh(new_procedure)
        return new_procedure

    @staticmethod
    def update(db_session: Session, procedure_id: int, procedure_data: ProcedureUpdate):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        
        update_data = procedure_data.model_dump(exclude_unset=True)
        responsible_role_ids = update_data.pop("responsible_role_ids", None)
        
        if "code" in update_data:
            ProcedureService.validate_code_unique(db_session, update_data["code"], exclude_procedure_id=procedure_id)
            
        for field_name, field_value in update_data.items():
            setattr(procedure, field_name, field_value)
            
        if responsible_role_ids is not None:
            roles = db_session.query(Role).filter(Role.id.in_(responsible_role_ids)).all()
            procedure.responsible_roles = roles
            
        db_session.commit()
        db_session.refresh(procedure)
        return procedure

    @staticmethod
    def delete(db_session: Session, procedure_id: int):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        db_session.delete(procedure)
        db_session.commit()
