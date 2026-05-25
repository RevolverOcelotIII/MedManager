from sqlalchemy.orm import Session
from app.models.attendance_procedure import AttendanceProcedure
from app.models.catalog import Medication
from app.schemas.attendance_procedures import AttendanceProcedureCreate, AttendanceProcedureUpdate
from app.services.utils import get_object_or_404
from typing import List

class AttendanceProcedureService:
    @staticmethod
    def get_all_by_attendance(db_session: Session, attendance_id: int) -> List[AttendanceProcedure]:
        return db_session.query(AttendanceProcedure).filter(
            AttendanceProcedure.attendance_id == attendance_id
        ).all()

    @staticmethod
    def get_by_id(db_session: Session, attendance_procedure_id: int) -> AttendanceProcedure:
        return get_object_or_404(db_session, AttendanceProcedure, attendance_procedure_id)

    @staticmethod
    def create(db_session: Session, attendance_procedure_data: AttendanceProcedureCreate) -> AttendanceProcedure:
        data = attendance_procedure_data.model_dump()
        medication_ids = data.pop("medication_ids", [])
        
        new_attendance_procedure = AttendanceProcedure(**data)
        
        if medication_ids:
            medications = db_session.query(Medication).filter(Medication.id.in_(medication_ids)).all()
            new_attendance_procedure.medications = medications
            
        db_session.add(new_attendance_procedure)
        db_session.commit()
        db_session.refresh(new_attendance_procedure)
        return new_attendance_procedure

    @staticmethod
    def update(db_session: Session, attendance_procedure_id: int, attendance_procedure_data: AttendanceProcedureUpdate) -> AttendanceProcedure:
        attendance_procedure = AttendanceProcedureService.get_by_id(db_session, attendance_procedure_id)
        
        update_data = attendance_procedure_data.model_dump(exclude_unset=True)
        medication_ids = update_data.pop("medication_ids", None)
        
        for field, value in update_data.items():
            setattr(attendance_procedure, field, value)
            
        if medication_ids is not None:
            medications = db_session.query(Medication).filter(Medication.id.in_(medication_ids)).all()
            attendance_procedure.medications = medications
            
        db_session.commit()
        db_session.refresh(attendance_procedure)
        return attendance_procedure

    @staticmethod
    def delete(db_session: Session, attendance_procedure_id: int):
        attendance_procedure = AttendanceProcedureService.get_by_id(db_session, attendance_procedure_id)
        db_session.delete(attendance_procedure)
        db_session.commit()
