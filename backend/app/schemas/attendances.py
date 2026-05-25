from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.attendance import AttendanceStatus

class AttendanceBase(BaseModel):
    patient_id: int
    status: AttendanceStatus = AttendanceStatus.WAITING_TRIAGE
    triage_notes: Optional[str] = None
    vitals_bp: Optional[str] = None
    vitals_temp: Optional[str] = None
    doctor_notes: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    status: Optional[AttendanceStatus] = None
    triage_notes: Optional[str] = None
    vitals_bp: Optional[str] = None
    vitals_temp: Optional[str] = None
    doctor_notes: Optional[str] = None
    finished_at: Optional[datetime] = None

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    finished_at: Optional[datetime] = None
    class Config:
        from_attributes = True
