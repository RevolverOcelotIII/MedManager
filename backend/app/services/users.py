from sqlalchemy.orm import Session
from app.models.user import User, Role
from app.schemas.users import UserCreate, UserUpdate
from app.core.security import hash_password
from fastapi import HTTPException
from typing import Optional

class UserService:
    @staticmethod
    def validate_email_unique(db_session: Session, email: str, exclude_user_id: Optional[int] = None):
        query = db_session.query(User).filter(User.email == email)
        if exclude_user_id:
            query = query.filter(User.id != exclude_user_id)
        existing_user = query.first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

    @staticmethod
    def validate_role_exists(db_session: Session, role_id: int):
        role = db_session.query(Role).filter(Role.id == role_id).first()
        if not role:
            raise HTTPException(status_code=400, detail="Role not found")

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(User).all()

    @staticmethod
    def get_by_id(db_session: Session, user_id: int):
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    @staticmethod
    def create(db_session: Session, user_data: UserCreate):
        UserService.validate_email_unique(db_session, user_data.email)
        UserService.validate_role_exists(db_session, user_data.role_id)
        
        user_dict = user_data.model_dump()
        raw_password = user_dict.pop("password")
        hashed_password = hash_password(raw_password)
        
        new_user = User(**user_dict, hashed_password=hashed_password)
        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)
        return new_user

    @staticmethod
    def update(db_session: Session, user_id: int, user_data: UserUpdate):
        user = UserService.get_by_id(db_session, user_id)
        
        update_data = user_data.model_dump(exclude_unset=True)
        
        if "email" in update_data:
            UserService.validate_email_unique(db_session, update_data["email"], exclude_user_id=user_id)
        
        if "role_id" in update_data:
            UserService.validate_role_exists(db_session, update_data["role_id"])
            
        if "password" in update_data:
            raw_password = update_data.pop("password")
            update_data["hashed_password"] = hash_password(raw_password)
            
        for field_name, field_value in update_data.items():
            setattr(user, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(user)
        return user
