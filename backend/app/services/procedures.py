from sqlalchemy.orm import Session
from app.models.catalog import Procedure
from app.models.employee import Role, AccessLevel
from app.models.user import User
from app.schemas.procedures import ProcedureCreate, ProcedureUpdate, ProcedureResponse
from app.services.utils import get_object_or_404, validate_unique
from app.core.redis import get_cache, set_cache, invalidate_cache
from typing import Optional, List

CACHE_PREFIX = "cache:procedures"

class ProcedureService:
    # --- Controller Entry Points ---

    @staticmethod
    def get_all(db_session: Session, current_user: User):
        is_admin = current_user.employee.role.access_level == AccessLevel.admin
        cache_key = f"{CACHE_PREFIX}:all" if is_admin else f"{CACHE_PREFIX}:role:{current_user.employee.role_id}"
        
        cached = get_cache(cache_key)
        if cached:
            return cached
            
        query = db_session.query(Procedure)
        query = ProcedureService.apply_role_based_dispatch_visibility(query, current_user)
        procedures = query.all()
        
        # Serialize
        proc_dicts = [ProcedureResponse.model_validate(p).model_dump(mode="json") for p in procedures]
        set_cache(cache_key, proc_dicts)
        
        return procedures

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
        
        invalidate_cache(f"{CACHE_PREFIX}:*")
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
        
        invalidate_cache(f"{CACHE_PREFIX}:*")
        return procedure

    @staticmethod
    def delete(db_session: Session, procedure_id: int):
        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        db_session.delete(procedure)
        db_session.commit()
        
        invalidate_cache(f"{CACHE_PREFIX}:*")

    # --- Business Logic & Associations ---

    @staticmethod
    def apply_role_based_dispatch_visibility(query, current_user: User):
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
