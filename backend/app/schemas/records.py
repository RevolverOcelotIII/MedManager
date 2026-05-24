from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class RecordType(str, Enum):
    MEDICATION = "medication"
    PROCEDURE = "procedure"

class MedicalRecordBase(BaseModel):
    patient_id: int
    category: RecordType
    medication_id: Optional[int] = None
    procedure_id: Optional[int] = None
    observation: Optional[str] = None

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordUpdate(BaseModel):
    observation: Optional[str] = None

class MedicalRecordResponse(MedicalRecordBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True
