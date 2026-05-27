from sqlalchemy.orm import Session
from app.models.user import User
from app.models.employee import Employee
from app.schemas.users import UserCreate, UserUpdate
from app.core.security import hash_password
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional

class UserService:
    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(User).order_by(User.updated_at.desc()).all()

    @staticmethod
    def get_by_id(db_session: Session, user_id: int):
        return get_object_or_404(db_session, User, user_id)

    @staticmethod
    def create(db_session: Session, user_data: UserCreate):
        validate_unique(db_session, User, {"email": user_data.email}, error_message="Email already registered")
        validate_unique(db_session, User, {"employee_id": user_data.employee_id}, error_message="Employee already has a user account")
        
        get_object_or_404(db_session, Employee, user_data.employee_id, error_message="Employee not found")
        
        new_user = User(
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            employee_id=user_data.employee_id
        )
        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)
        return new_user

    @staticmethod
    def update(db_session: Session, user_id: int, user_data: UserUpdate):
        user = UserService.get_by_id(db_session, user_id)
        
        update_data = user_data.model_dump(exclude_unset=True)
        
        if "email" in update_data:
            validate_unique(db_session, User, {"email": update_data["email"]}, exclude_id=user_id, error_message="Email already registered")
            
        if "password" in update_data:
            user.hashed_password = hash_password(update_data.pop("password"))
            
        for field_name, field_value in update_data.items():
            setattr(user, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(user)
        return user

    @staticmethod
    def delete(db_session: Session, user_id: int):
        user = UserService.get_by_id(db_session, user_id)
        db_session.delete(user)
        db_session.commit()
