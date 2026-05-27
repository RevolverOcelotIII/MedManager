from sqlalchemy.orm import Session
from app.models.employee import Role
from app.schemas.roles import RoleCreate, RoleUpdate, RoleResponse
from app.services.utils import get_object_or_404, validate_unique
from app.core.redis import get_cache, set_cache, invalidate_cache
from typing import Optional

CACHE_KEY = "cache:roles:all"

class RoleService:
    @staticmethod
    def validate_name_unique(db_session: Session, name: str, exclude_role_id: Optional[int] = None):
        validate_unique(
            db_session, 
            Role, 
            {"name": name}, 
            exclude_id=exclude_role_id, 
            error_message="Role name already registered"
        )

    @staticmethod
    def get_all(db_session: Session):
        cached = get_cache(CACHE_KEY)
        if cached:
            return cached
            
        roles = db_session.query(Role).all()
        # Serialize to dicts for caching
        role_dicts = [RoleResponse.model_validate(r).model_dump(mode="json") for r in roles]
        set_cache(CACHE_KEY, role_dicts)
        return roles

    @staticmethod
    def get_by_id(db_session: Session, role_id: int):
        return get_object_or_404(db_session, Role, role_id)

    @staticmethod
    def create(db_session: Session, role_data: RoleCreate):
        RoleService.validate_name_unique(db_session, role_data.name)
        
        new_role = Role(**role_data.model_dump())
        db_session.add(new_role)
        db_session.commit()
        db_session.refresh(new_role)
        
        invalidate_cache(CACHE_KEY)
        return new_role

    @staticmethod
    def update(db_session: Session, role_id: int, role_data: RoleUpdate):
        role = RoleService.get_by_id(db_session, role_id)
        
        update_data = role_data.model_dump(exclude_unset=True)
        
        if "name" in update_data:
            RoleService.validate_name_unique(db_session, update_data["name"], exclude_role_id=role_id)
            
        for field_name, field_value in update_data.items():
            setattr(role, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(role)
        
        invalidate_cache(CACHE_KEY)
        return role

    @staticmethod
    def delete(db_session: Session, role_id: int):
        role = RoleService.get_by_id(db_session, role_id)
        db_session.delete(role)
        db_session.commit()
        
        invalidate_cache(CACHE_KEY)
