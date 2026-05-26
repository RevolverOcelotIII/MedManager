from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.attendance_procedure import AttendanceProcedure, AttendanceProcedureStatus
from app.models.catalog import Medication
from app.models.employee import AccessLevel, Employee
from app.models.user import User
from app.schemas.attendance_procedures import AttendanceProcedureCreate, AttendanceProcedureUpdate
from app.services.utils import get_object_or_404
from app.services.procedures import ProcedureService
from typing import List, Optional

class AttendanceProcedureService:
    # --- Controller Entry Points ---

    @staticmethod
    def get_all_by_attendance(db_session: Session, attendance_id: int) -> List[AttendanceProcedure]:
        return db_session.query(AttendanceProcedure).filter(
            AttendanceProcedure.attendance_id == attendance_id
        ).all()

    @staticmethod
    def get_by_id(db_session: Session, attendance_procedure_id: int) -> AttendanceProcedure:
        return get_object_or_404(db_session, AttendanceProcedure, attendance_procedure_id)

    @staticmethod
    def create(db_session: Session, attendance_procedure_data: AttendanceProcedureCreate, current_user: User) -> AttendanceProcedure:
        attendance_procedure_data.ordered_by_id = current_user.employee_id
        
        AttendanceProcedureService.validate_user_can_dispatch_procedure(
            db_session, 
            attendance_procedure_data.procedure_id, 
            current_user
        )
        
        if current_user.employee.role.access_level in [AccessLevel.doctor, AccessLevel.nurse]:
            attendance_procedure_data.executed_by_id = None
            
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
    def update(db_session: Session, attendance_procedure_id: int, attendance_procedure_data: AttendanceProcedureUpdate, current_user: User) -> AttendanceProcedure:
        attendance_procedure = AttendanceProcedureService.get_by_id(db_session, attendance_procedure_id)
        
        authorized_data = AttendanceProcedureService.get_authorized_update_data(
            attendance_procedure, 
            attendance_procedure_data, 
            current_user
        )
        
        update_dict = authorized_data.model_dump(exclude_unset=True)
        medication_ids = update_dict.pop("medication_ids", None)
        
        for field, value in update_dict.items():
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

    # --- Business Logic & Authorization ---

    @staticmethod
    def get_authorized_update_data(
        attendance_procedure: AttendanceProcedure, 
        update_data: AttendanceProcedureUpdate, 
        current_user: User
    ) -> AttendanceProcedureUpdate:
        if current_user.employee.role.access_level == AccessLevel.admin:
            return update_data

        if AttendanceProcedureService.is_attendant_restricted_to_status_only(attendance_procedure, current_user) or \
           AttendanceProcedureService.is_med_professional_restricted_to_status_only(attendance_procedure, current_user):
            return AttendanceProcedureService.restrict_to_status_only_payload(update_data)

        AttendanceProcedureService.strip_clinical_fields_for_attendants(update_data, current_user)
        return update_data

    @staticmethod
    def restrict_to_status_only_payload(update_data: AttendanceProcedureUpdate) -> AttendanceProcedureUpdate:
        new_status = update_data.status
        if not new_status: 
            raise HTTPException(status_code=403, detail="You can only update the status of this procedure.")
        return AttendanceProcedureUpdate(status=new_status)

    @staticmethod
    def is_attendant_restricted_to_status_only(attendance_procedure: AttendanceProcedure, current_user: User) -> bool:
        return current_user.employee.role.access_level == AccessLevel.attendant and \
               attendance_procedure.ordered_by_id != current_user.employee_id

    @staticmethod
    def is_med_professional_restricted_to_status_only(attendance_procedure: AttendanceProcedure, current_user: User) -> bool:
        is_med = current_user.employee.role.access_level in [AccessLevel.doctor, AccessLevel.nurse]
        if not is_med:
            return False
            
        is_owner_or_executor = current_user.employee_id in [attendance_procedure.ordered_by_id, attendance_procedure.executed_by_id]
        return not is_owner_or_executor

    @staticmethod
    def strip_clinical_fields_for_attendants(update_data: AttendanceProcedureUpdate, current_user: User):
        if current_user.employee.role.access_level == AccessLevel.attendant:
            update_data.description = None
            update_data.medication_ids = None

    # --- Validations ---

    @staticmethod
    def validate_user_can_dispatch_procedure(db_session: Session, procedure_id: int, current_user: User):
        if current_user.employee.role.access_level == AccessLevel.admin:
            return

        procedure = ProcedureService.get_by_id(db_session, procedure_id)
        authorized_role_ids = [role.id for role in procedure.dispatch_roles]
        
        if current_user.employee.role_id not in authorized_role_ids:
            raise HTTPException(
                status_code=403, 
                detail=f"Your role ({current_user.employee.role.name}) is not authorized to dispatch this procedure."
            )
