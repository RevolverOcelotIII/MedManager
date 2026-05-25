from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.schemas.attendances import AttendanceCreate, AttendanceUpdate
from app.services.utils import get_object_or_404
from typing import Optional

class AttendanceService:
    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(Attendance).all()

    @staticmethod
    def get_by_id(db_session: Session, attendance_id: int):
        return get_object_or_404(db_session, Attendance, attendance_id)

    @staticmethod
    def create(db_session: Session, attendance_data: AttendanceCreate):
        new_attendance = Attendance(**attendance_data.model_dump())
        db_session.add(new_attendance)
        db_session.commit()
        db_session.refresh(new_attendance)
        return new_attendance

    @staticmethod
    def update(db_session: Session, attendance_id: int, attendance_data: AttendanceUpdate):
        attendance = AttendanceService.get_by_id(db_session, attendance_id)
        update_data = attendance_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(attendance, field, value)
            
        db_session.commit()
        db_session.refresh(attendance)
        return attendance

    @staticmethod
    def delete(db_session: Session, attendance_id: int):
        attendance = AttendanceService.get_by_id(db_session, attendance_id)
        db_session.delete(attendance)
        db_session.commit()
