from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from app.models.patient import Sex, BloodType

class PatientBase(BaseModel):
    full_name: str
    social_name: Optional[str] = None
    cpf: str
    rg: Optional[str] = None
    birth_date: date
    sex: Optional[Sex] = None
    marital_status: Optional[str] = None
    nationality: Optional[str] = None
    mother_name: Optional[str] = None
    phone: Optional[str] = None
    blood_type: Optional[BloodType] = None
    allergies: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    social_name: Optional[str] = None
    cpf: Optional[str] = None
    rg: Optional[str] = None
    birth_date: Optional[date] = None
    sex: Optional[Sex] = None
    marital_status: Optional[str] = None
    nationality: Optional[str] = None
    mother_name: Optional[str] = None
    phone: Optional[str] = None
    blood_type: Optional[BloodType] = None
    allergies: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
