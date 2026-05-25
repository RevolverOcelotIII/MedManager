from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.medications import MedicationResponse
from app.schemas.procedures import ProcedureResponse
from app.schemas.employees import EmployeeResponse
from app.models.attendance_procedure import AttendanceProcedureStatus

class AttendanceProcedureBase(BaseModel):
    attendance_id: int
    procedure_id: int
    status: AttendanceProcedureStatus = AttendanceProcedureStatus.pending
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    ordered_by_id: Optional[int] = None
    executed_by_id: Optional[int] = None

class AttendanceProcedureCreate(AttendanceProcedureBase):
    medication_ids: Optional[List[int]] = []

class AttendanceProcedureUpdate(BaseModel):
    status: Optional[AttendanceProcedureStatus] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    ordered_by_id: Optional[int] = None
    executed_by_id: Optional[int] = None
    medication_ids: Optional[List[int]] = None

class AttendanceProcedureResponse(AttendanceProcedureBase):
    id: int
    procedure: ProcedureResponse
    ordered_by: Optional[EmployeeResponse] = None
    executed_by: Optional[EmployeeResponse] = None
    medications: List[MedicationResponse]
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
