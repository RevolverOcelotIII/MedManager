from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.schemas.attendances import AttendanceCreate, AttendanceUpdate, AttendanceResponse
from app.services.utils import get_object_or_404
from app.core.redis import get_cache, set_cache, invalidate_cache
from typing import Optional

CACHE_KEY = "cache:attendances:all"

class AttendanceService:
    @staticmethod
    def get_all(db_session: Session):
        cached = get_cache(CACHE_KEY)
        if cached:
            return cached
            
        attendances = db_session.query(Attendance).all()
        att_dicts = [AttendanceResponse.model_validate(a).model_dump(mode="json") for a in attendances]
        set_cache(CACHE_KEY, att_dicts)
        return attendances

    @staticmethod
    def get_by_id(db_session: Session, attendance_id: int):
        return get_object_or_404(db_session, Attendance, attendance_id)

    @staticmethod
    def create(db_session: Session, attendance_data: AttendanceCreate):
        new_attendance = Attendance(**attendance_data.model_dump())
        db_session.add(new_attendance)
        db_session.commit()
        db_session.refresh(new_attendance)
        
        invalidate_cache(CACHE_KEY)
        return new_attendance

    @staticmethod
    def update(db_session: Session, attendance_id: int, attendance_data: AttendanceUpdate):
        attendance = AttendanceService.get_by_id(db_session, attendance_id)
        update_data = attendance_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(attendance, field, value)
            
        db_session.commit()
        db_session.refresh(attendance)
        
        invalidate_cache(CACHE_KEY)
        return attendance

    @staticmethod
    def delete(db_session: Session, attendance_id: int):
        attendance = AttendanceService.get_by_id(db_session, attendance_id)
        db_session.delete(attendance)
        db_session.commit()
        
        invalidate_cache(CACHE_KEY)
