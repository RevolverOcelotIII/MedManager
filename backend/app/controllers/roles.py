from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.schemas.roles import RoleResponse, RoleCreate, RoleUpdate
from app.services.roles import RoleService
from typing import List

router = APIRouter(prefix="/roles", tags=["Roles"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[RoleResponse])
def list_roles(db_session: Session = Depends(get_db)):
    return RoleService.get_all(db_session)

@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, db_session: Session = Depends(get_db)):
    return RoleService.get_by_id(db_session, role_id)

@router.post("/", response_model=RoleResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_role(role_data: RoleCreate, db_session: Session = Depends(get_db)):
    return RoleService.create(db_session, role_data)

@router.put("/{role_id}", response_model=RoleResponse, dependencies=[Depends(require_admin)])
def update_role(role_id: int, role_data: RoleUpdate, db_session: Session = Depends(get_db)):
    return RoleService.update(db_session, role_id, role_data)

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_role(role_id: int, db_session: Session = Depends(get_db)):
    RoleService.delete(db_session, role_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
