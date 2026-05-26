from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.schemas.attendance_procedures import AttendanceProcedureResponse, AttendanceProcedureCreate, AttendanceProcedureUpdate
from app.services.attendance_procedures import AttendanceProcedureService
from app.models.user import User
from typing import List

router = APIRouter(prefix="/attendance-procedures", tags=["Attendance Procedures"], dependencies=[Depends(get_current_user)])

@router.get("/attendance/{attendance_id}", response_model=List[AttendanceProcedureResponse])
def list_by_attendance(attendance_id: int, db_session: Session = Depends(get_db)):
    return AttendanceProcedureService.get_all_by_attendance(db_session, attendance_id)

@router.get("/{attendance_procedure_id}", response_model=AttendanceProcedureResponse)
def get_attendance_procedure(attendance_procedure_id: int, db_session: Session = Depends(get_db)):
    return AttendanceProcedureService.get_by_id(db_session, attendance_procedure_id)

@router.post("/", response_model=AttendanceProcedureResponse, status_code=status.HTTP_201_CREATED)
def create_attendance_procedure(attendance_procedure_data: AttendanceProcedureCreate, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    return AttendanceProcedureService.create(db_session, attendance_procedure_data, current_user)

@router.put("/{attendance_procedure_id}", response_model=AttendanceProcedureResponse)
def update_attendance_procedure(attendance_procedure_id: int, attendance_procedure_data: AttendanceProcedureUpdate, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    return AttendanceProcedureService.update(db_session, attendance_procedure_id, attendance_procedure_data, current_user)

@router.delete("/{attendance_procedure_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_attendance_procedure(attendance_procedure_id: int, db_session: Session = Depends(get_db)):
    AttendanceProcedureService.delete(db_session, attendance_procedure_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
