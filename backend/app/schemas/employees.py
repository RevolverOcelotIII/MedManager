from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from app.models.patient import Sex
from app.models.employee import EmploymentType, AccessLevel

class RoleBase(BaseModel):
    name: str
    access_level: AccessLevel = AccessLevel.attendant

class RoleResponse(RoleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class EmployeeBase(BaseModel):
    full_name: str
    social_name: Optional[str] = None
    cpf: str
    rg: Optional[str] = None
    birth_date: date
    sex: Optional[Sex] = None
    marital_status: Optional[str] = None
    nationality: Optional[str] = None
    phone: Optional[str] = None
    hire_date: date
    termination_date: Optional[date] = None
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    salary: Optional[Decimal] = None
    active: bool = True
    role_id: int

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    social_name: Optional[str] = None
    cpf: Optional[str] = None
    rg: Optional[str] = None
    birth_date: Optional[date] = None
    sex: Optional[Sex] = None
    marital_status: Optional[str] = None
    nationality: Optional[str] = None
    phone: Optional[str] = None
    hire_date: Optional[date] = None
    termination_date: Optional[date] = None
    employment_type: Optional[EmploymentType] = None
    salary: Optional[Decimal] = None
    active: Optional[bool] = None
    role_id: Optional[int] = None

class EmployeeResponse(EmployeeBase):
    id: int
    role: Optional[RoleResponse] = None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
