from pydantic import BaseModel, EmailStr
from typing import Optional
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
    class Config:
        from_attributes = True
