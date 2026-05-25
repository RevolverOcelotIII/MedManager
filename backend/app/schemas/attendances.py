from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.attendance import GravityLevel

class AttendanceBase(BaseModel):
    patient_id: int
    gravity: GravityLevel = GravityLevel.green

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    gravity: Optional[GravityLevel] = None
    finished_at: Optional[datetime] = None

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    finished_at: Optional[datetime] = None
    class Config:
        from_attributes = True
