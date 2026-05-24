from pydantic import BaseModel
from datetime import date
from typing import Optional

class PatientBase(BaseModel):
    full_name: str
    cpf: str
    birth_date: date

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    cpf: Optional[str] = None
    birth_date: Optional[date] = None

class PatientResponse(PatientBase):
    id: int
    class Config:
        from_attributes = True
