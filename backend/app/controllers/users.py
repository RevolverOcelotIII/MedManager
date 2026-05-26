from fastapi import APIRouter, Depends, status, Response, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.schemas.users import UserResponse, UserCreate, UserUpdate
from app.services.users import UserService
from app.models.user import User
from app.models.employee import AccessLevel
from typing import List

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[UserResponse], dependencies=[Depends(require_admin)])
def list_users(db_session: Session = Depends(get_db)):
    return UserService.get_all(db_session)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    if current_user.id != user_id and current_user.employee.role.access_level != AccessLevel.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return UserService.get_by_id(db_session, user_id)

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_user(user_data: UserCreate, db_session: Session = Depends(get_db)):
    return UserService.create(db_session, user_data)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_data: UserUpdate, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    if current_user.id != user_id and current_user.employee.role.access_level != AccessLevel.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    if current_user.employee.role.access_level != AccessLevel.admin:
        user_data.email = None
        user_data.employee_id = None
        
    return UserService.update(db_session, user_id, user_data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_user(user_id: int, db_session: Session = Depends(get_db)):
    UserService.delete(db_session, user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
