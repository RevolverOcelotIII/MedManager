from sqlalchemy.orm import Session
from app.models.user import User
from app.models.employee import Employee
from app.schemas.users import UserCreate, UserUpdate
from app.core.security import hash_password
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional

class UserService:
    @staticmethod
    def validate_email_unique(db_session: Session, email: str, exclude_user_id: Optional[int] = None):
        validate_unique(
            db_session, 
            User, 
            {"email": email}, 
            exclude_id=exclude_user_id, 
            error_message="Email already registered"
        )

    @staticmethod
    def validate_employee_linkable(db_session: Session, employee_id: int, exclude_user_id: Optional[int] = None):
        # Ensure employee exists
        get_object_or_404(db_session, Employee, employee_id, error_message="Employee not found")
        
        # Ensure employee is not already linked to another user
        validate_unique(
            db_session,
            User,
            {"employee_id": employee_id},
            exclude_id=exclude_user_id,
            error_message="Employee is already linked to a user"
        )

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(User).all()

    @staticmethod
    def get_by_id(db_session: Session, user_id: int):
        return get_object_or_404(db_session, User, user_id)

    @staticmethod
    def create(db_session: Session, user_data: UserCreate):
        UserService.validate_email_unique(db_session, user_data.email)
        UserService.validate_employee_linkable(db_session, user_data.employee_id)
        
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
        
        if "employee_id" in update_data:
            UserService.validate_employee_linkable(db_session, update_data["employee_id"], exclude_user_id=user_id)
            
        if "password" in update_data:
            raw_password = update_data.pop("password")
            update_data["hashed_password"] = hash_password(raw_password)
            
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
