from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class RecordType(str, Enum):
    MEDICATION = "medication"
    PROCEDURE = "procedure"

class RecordStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class MedicalRecordBase(BaseModel):
    patient_id: int
    employee_id: int
    category: RecordType
    status: RecordStatus = RecordStatus.PENDING
    active: bool = True
    medication_id: Optional[int] = None
    procedure_id: Optional[int] = None
    observation: Optional[str] = None
    registration_date: Optional[datetime] = None

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordUpdate(BaseModel):
    employee_id: Optional[int] = None
    status: Optional[RecordStatus] = None
    active: Optional[bool] = None
    observation: Optional[str] = None
    registration_date: Optional[datetime] = None

class MedicalRecordResponse(MedicalRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
