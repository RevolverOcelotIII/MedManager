from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class RoleBase(BaseModel):
    name: str

class RoleResponse(RoleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class EmployeeBase(BaseModel):
    full_name: str
    cpf: str
    birth_date: date
    role_id: int

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    cpf: Optional[str] = None
    birth_date: Optional[date] = None
    role_id: Optional[int] = None

class EmployeeResponse(EmployeeBase):
    id: int
    role: Optional[RoleResponse] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
