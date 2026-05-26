from fastapi import APIRouter, Depends, status, Response, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.schemas.attendance_procedures import AttendanceProcedureResponse, AttendanceProcedureCreate, AttendanceProcedureUpdate
from app.services.attendance_procedures import AttendanceProcedureService
from app.models.user import User
from app.models.employee import AccessLevel
from app.models.attendance_procedure import AttendanceProcedureStatus
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
    user_access = current_user.employee.role.access_level
    allowed_creators = [AccessLevel.admin, AccessLevel.attendant, AccessLevel.doctor, AccessLevel.nurse]
    
    if user_access not in allowed_creators:
        raise HTTPException(status_code=403, detail="Not authorized to create procedure records.")

    # ordered_by should always be the logged user
    attendance_procedure_data.ordered_by_id = current_user.employee_id
    
    # meds can create procedure attendances but not assign anybody
    if user_access in [AccessLevel.doctor, AccessLevel.nurse]:
        attendance_procedure_data.executed_by_id = None
        
    return AttendanceProcedureService.create(db_session, attendance_procedure_data)

@router.put("/{attendance_procedure_id}", response_model=AttendanceProcedureResponse)
def update_attendance_procedure(attendance_procedure_id: int, attendance_procedure_data: AttendanceProcedureUpdate, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    attendance_procedure = AttendanceProcedureService.get_by_id(db_session, attendance_procedure_id)
    user_access = current_user.employee.role.access_level

    # 1. Admin has full access
    if user_access == AccessLevel.admin:
        return AttendanceProcedureService.update(db_session, attendance_procedure_id, attendance_procedure_data)

    # Prepare status-only update if ownership/assignment check fails
    is_status_only = False
    
    # 2. LOG Scope (Attendant)
    if user_access == AccessLevel.attendant:
        if attendance_procedure.ordered_by_id != current_user.employee_id:
            is_status_only = True
        
        # Attendants can never edit medical details
        attendance_procedure_data.description = None
        attendance_procedure_data.medication_ids = None

    # 3. MED Scope (Doctor/Nurse)
    elif user_access in [AccessLevel.doctor, AccessLevel.nurse]:
        # Can update full details if they are the creator OR the assigned executor
        if current_user.employee_id not in [attendance_procedure.ordered_by_id, attendance_procedure.executed_by_id]:
            is_status_only = True

    # Apply status-only restriction if necessary
    if is_status_only:
        # Save only the status, nullify everything else in the update schema
        new_status = attendance_procedure_data.status
        attendance_procedure_data = AttendanceProcedureUpdate(status=new_status)
        if not new_status: 
             raise HTTPException(status_code=403, detail="You can only update the status of this procedure.")

    return AttendanceProcedureService.update(db_session, attendance_procedure_id, attendance_procedure_data)

@router.delete("/{attendance_procedure_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_attendance_procedure(attendance_procedure_id: int, db_session: Session = Depends(get_db)):
    AttendanceProcedureService.delete(db_session, attendance_procedure_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
