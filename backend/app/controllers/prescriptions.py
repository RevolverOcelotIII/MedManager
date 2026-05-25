from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.schemas.prescriptions import PrescriptionResponse, PrescriptionCreate, PrescriptionUpdate
from app.services.prescriptions import PrescriptionService
from typing import List

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"], dependencies=[Depends(get_current_user)])

@router.get("/attendance/{attendance_id}", response_model=List[PrescriptionResponse])
def list_prescriptions_by_attendance(attendance_id: int, db_session: Session = Depends(get_db)):
    return PrescriptionService.get_all_by_attendance(db_session, attendance_id)

@router.get("/{prescription_id}", response_model=PrescriptionResponse)
def get_prescription(prescription_id: int, db_session: Session = Depends(get_db)):
    return PrescriptionService.get_by_id(db_session, prescription_id)

@router.post("/", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
def create_prescription(prescription_data: PrescriptionCreate, db_session: Session = Depends(get_db)):
    return PrescriptionService.create(db_session, prescription_data)

@router.put("/{prescription_id}", response_model=PrescriptionResponse)
def update_prescription(prescription_id: int, prescription_data: PrescriptionUpdate, db_session: Session = Depends(get_db)):
    return PrescriptionService.update(db_session, prescription_id, prescription_data)

@router.delete("/{prescription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prescription(prescription_id: int, db_session: Session = Depends(get_db)):
    PrescriptionService.delete(db_session, prescription_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
