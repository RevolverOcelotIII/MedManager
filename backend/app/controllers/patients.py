from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.schemas.patients import PatientResponse, PatientCreate, PatientUpdate
from app.services.patients import PatientService
from typing import List

router = APIRouter(prefix="/patients", tags=["Patients"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[PatientResponse])
def list_patients(db_session: Session = Depends(get_db)):
    return PatientService.get_all(db_session)

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db_session: Session = Depends(get_db)):
    return PatientService.get_by_id(db_session, patient_id)

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient_data: PatientCreate, db_session: Session = Depends(get_db)):
    return PatientService.create(db_session, patient_data)

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, patient_data: PatientUpdate, db_session: Session = Depends(get_db)):
    return PatientService.update(db_session, patient_id, patient_data)

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db_session: Session = Depends(get_db)):
    PatientService.delete(db_session, patient_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
