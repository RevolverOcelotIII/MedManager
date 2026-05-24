from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.schemas.medications import MedicationResponse, MedicationCreate, MedicationUpdate
from app.services.medications import MedicationService
from typing import List

router = APIRouter(prefix="/medications", tags=["Medications"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[MedicationResponse])
def list_medications(db_session: Session = Depends(get_db)):
    return MedicationService.get_all(db_session)

@router.get("/{medication_id}", response_model=MedicationResponse)
def get_medication(medication_id: int, db_session: Session = Depends(get_db)):
    return MedicationService.get_by_id(db_session, medication_id)

@router.post("/", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
def create_medication(medication_data: MedicationCreate, db_session: Session = Depends(get_db)):
    return MedicationService.create(db_session, medication_data)

@router.put("/{medication_id}", response_model=MedicationResponse)
def update_medication(medication_id: int, medication_data: MedicationUpdate, db_session: Session = Depends(get_db)):
    return MedicationService.update(db_session, medication_id, medication_data)

@router.delete("/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(medication_id: int, db_session: Session = Depends(get_db)):
    MedicationService.delete(db_session, medication_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
