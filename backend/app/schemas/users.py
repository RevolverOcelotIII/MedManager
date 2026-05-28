from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.schemas.employees import EmployeeResponse

class UserBase(BaseModel):
    email: EmailStr
    employee_id: int

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    employee_id: Optional[int] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    employee: Optional[EmployeeResponse] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
