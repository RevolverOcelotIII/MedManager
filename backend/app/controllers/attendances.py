from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.schemas.attendances import AttendanceResponse, AttendanceCreate, AttendanceUpdate
from app.services.attendances import AttendanceService
from typing import List

router = APIRouter(prefix="/attendances", tags=["Attendances"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[AttendanceResponse])
def list_attendances(db_session: Session = Depends(get_db)):
    return AttendanceService.get_all(db_session)

@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(attendance_id: int, db_session: Session = Depends(get_db)):
    return AttendanceService.get_by_id(db_session, attendance_id)

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def create_attendance(attendance_data: AttendanceCreate, db_session: Session = Depends(get_db)):
    return AttendanceService.create(db_session, attendance_data)

@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(attendance_id: int, attendance_data: AttendanceUpdate, db_session: Session = Depends(get_db)):
    return AttendanceService.update(db_session, attendance_id, attendance_data)

@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(attendance_id: int, db_session: Session = Depends(get_db)):
    AttendanceService.delete(db_session, attendance_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
