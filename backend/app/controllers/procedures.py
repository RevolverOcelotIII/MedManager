from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.schemas.procedures import ProcedureResponse, ProcedureCreate, ProcedureUpdate
from app.services.procedures import ProcedureService
from typing import List

router = APIRouter(prefix="/procedures", tags=["Procedures"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[ProcedureResponse])
def list_procedures(db_session: Session = Depends(get_db)):
    return ProcedureService.get_all(db_session)

@router.get("/{procedure_id}", response_model=ProcedureResponse)
def get_procedure(procedure_id: int, db_session: Session = Depends(get_db)):
    return ProcedureService.get_by_id(db_session, procedure_id)

@router.post("/", response_model=ProcedureResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_procedure(procedure_data: ProcedureCreate, db_session: Session = Depends(get_db)):
    return ProcedureService.create(db_session, procedure_data)

@router.put("/{procedure_id}", response_model=ProcedureResponse, dependencies=[Depends(require_admin)])
def update_procedure(procedure_id: int, procedure_data: ProcedureUpdate, db_session: Session = Depends(get_db)):
    return ProcedureService.update(db_session, procedure_id, procedure_data)

@router.delete("/{procedure_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_procedure(procedure_id: int, db_session: Session = Depends(get_db)):
    ProcedureService.delete(db_session, procedure_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
