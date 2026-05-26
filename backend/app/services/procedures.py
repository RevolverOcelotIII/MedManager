from sqlalchemy.orm import Session
from app.models.catalog import Procedure
from app.models.employee import Role, AccessLevel
from app.models.user import User
from app.schemas.procedures import ProcedureCreate, ProcedureUpdate
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional, List

class ProcedureService:
    # --- Controller Entry Points ---

    @staticmethod
    def get_all(db_session: Session, current_user: User):
        query = db_session.query(Procedure)
        query = ProcedureService.apply_role_based_dispatch_visibility(query, current_user)
        return query.all()

    @staticmethod
    def get_by_id(db_session: Session, procedure_id: int):
        return get_object_or_404(db_session, Procedure, procedure_id)

    @staticmethod
    def create(db_session: Session, procedure_data: ProcedureCreate):
        ProcedureService.validate_procedure_code_is_unique(db_session, procedure_data.code)
        
        data = procedure_data.model_dump()
        dispatch_role_ids = data.pop("dispatch_role_ids", [])
        execute_role_ids = data.pop("execute_role_ids", [])
        
        new_procedure = Procedure(**data)
        ProcedureService.apply_professional_role_associations(db_session, new_procedure, dispatch_role_ids, execute_role_ids)
            
        db_session.add(new_procedure)
        db_session.commit()
        db_session.refresh(new_procedure)
        return new_procedure

    @staticmethod
    def update(db_session: Session, procedure_id: int, procedure_data: ProcedureUpdate):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        
        update_data = procedure_data.model_dump(exclude_unset=True)
        dispatch_role_ids = update_data.pop("dispatch_role_ids", None)
        execute_role_ids = update_data.pop("execute_role_ids", None)
        
        if "code" in update_data:
            ProcedureService.validate_procedure_code_is_unique(db_session, update_data["code"], exclude_procedure_id=procedure_id)
            
        for field_name, field_value in update_data.items():
            setattr(procedure, field_name, field_value)
            
        ProcedureService.apply_professional_role_associations(db_session, procedure, dispatch_role_ids, execute_role_ids)
            
        db_session.commit()
        db_session.refresh(procedure)
        return procedure

    @staticmethod
    def delete(db_session: Session, procedure_id: int):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        db_session.delete(procedure)
        db_session.commit()

    # --- Business Logic & Associations ---

    @staticmethod
    def apply_role_based_dispatch_visibility(query, current_user: User):
        """
        Encapsulated Business Rule: Only return procedures that the user's role is authorized to dispatch.
        Administrators are exempt from this restriction.
        """
        if current_user.employee.role.access_level == AccessLevel.admin:
            return query
            
        from app.models.catalog import procedure_dispatch_roles
        return query.join(procedure_dispatch_roles, Procedure.id == procedure_dispatch_roles.c.procedure_id)\
                    .filter(procedure_dispatch_roles.c.role_id == current_user.employee.role_id)

    @staticmethod
    def apply_professional_role_associations(db_session: Session, procedure: Procedure, dispatch_ids: Optional[List[int]], execute_ids: Optional[List[int]]):
        if dispatch_ids is not None:
            roles = db_session.query(Role).filter(Role.id.in_(dispatch_ids)).all()
            procedure.dispatch_roles = roles
            
        if execute_ids is not None:
            roles = db_session.query(Role).filter(Role.id.in_(execute_ids)).all()
            procedure.execute_roles = roles

    # --- Validations ---

    @staticmethod
    def validate_procedure_code_is_unique(db_session: Session, code: str, exclude_procedure_id: Optional[int] = None):
        if code:
            validate_unique(
                db_session, 
                Procedure, 
                {"code": code}, 
                exclude_id=exclude_procedure_id, 
                error_message="Procedure with this code already exists"
            )
