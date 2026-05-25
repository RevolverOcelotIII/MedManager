from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.schemas.medical_records import MedicalRecordResponse, MedicalRecordCreate, MedicalRecordUpdate
from app.services.medical_records import MedicalRecordService
from typing import List

router = APIRouter(prefix="/medical-records", tags=["Medical Records"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[MedicalRecordResponse])
def list_medical_records(db_session: Session = Depends(get_db)):
    return MedicalRecordService.get_all(db_session)

@router.get("/{record_id}", response_model=MedicalRecordResponse)
def get_medical_record(record_id: int, db_session: Session = Depends(get_db)):
    return MedicalRecordService.get_by_id(db_session, record_id)

@router.post("/", response_model=MedicalRecordResponse, status_code=status.HTTP_201_CREATED)
def create_medical_record(record_data: MedicalRecordCreate, db_session: Session = Depends(get_db)):
    return MedicalRecordService.create(db_session, record_data)

@router.put("/{record_id}", response_model=MedicalRecordResponse)
def update_medical_record(record_id: int, record_data: MedicalRecordUpdate, db_session: Session = Depends(get_db)):
    return MedicalRecordService.update(db_session, record_id, record_data)

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medical_record(record_id: int, db_session: Session = Depends(get_db)):
    MedicalRecordService.delete(db_session, record_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
