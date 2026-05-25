from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PrescriptionBase(BaseModel):
    attendance_id: int
    medication_id: int
    dosage: str
    is_executed: bool = False

class PrescriptionCreate(PrescriptionBase):
    pass

class PrescriptionUpdate(BaseModel):
    dosage: Optional[str] = None
    is_executed: Optional[bool] = None

class PrescriptionResponse(PrescriptionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
