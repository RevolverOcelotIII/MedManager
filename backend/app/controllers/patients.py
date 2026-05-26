from fastapi import APIRouter, Depends, status, Response, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_log_scope, require_admin
from app.schemas.patients import PatientResponse, PatientCreate, PatientUpdate
from app.services.patients import PatientService
from app.models.employee import AccessLevel
from app.models.user import User
from typing import List

router = APIRouter(prefix="/patients", tags=["Patients"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[PatientResponse])
def list_patients(current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    med_id = None
    if current_user.employee.role.access_level in [AccessLevel.doctor, AccessLevel.nurse]:
        med_id = current_user.employee_id
    return PatientService.get_all(db_session, med_employee_id=med_id)

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    med_id = None
    if current_user.employee.role.access_level in [AccessLevel.doctor, AccessLevel.nurse]:
        med_id = current_user.employee_id
    return PatientService.get_by_id(db_session, patient_id, med_employee_id=med_id)

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_log_scope)])
def create_patient(patient_data: PatientCreate, db_session: Session = Depends(get_db)):
    return PatientService.create(db_session, patient_data)

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, patient_data: PatientUpdate, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    # Both LOG and MED scopes can update. (Log for registration, Med for blood type/allergies)
    allowed_levels = [AccessLevel.admin, AccessLevel.attendant, AccessLevel.doctor, AccessLevel.nurse]
    if current_user.employee.role.access_level not in allowed_levels:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update patient data")
        
    return PatientService.update(db_session, patient_id, patient_data)

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_patient(patient_id: int, db_session: Session = Depends(get_db)):
    PatientService.delete(db_session, patient_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
