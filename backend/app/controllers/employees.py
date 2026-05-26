from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_admin
from app.schemas.employees import EmployeeResponse, RestrictedEmployeeResponse, EmployeeCreate, EmployeeUpdate, RoleResponse
from app.services.employees import EmployeeService
from app.services.roles import RoleService
from app.models.user import User
from typing import List, Union

router = APIRouter(prefix="/employees", tags=["Employees"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=List[Union[EmployeeResponse, RestrictedEmployeeResponse]])
def list_employees(current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    return EmployeeService.get_all(db_session, current_user)

@router.get("/{employee_id}", response_model=Union[EmployeeResponse, RestrictedEmployeeResponse])
def get_employee(employee_id: int, current_user: User = Depends(get_current_user), db_session: Session = Depends(get_db)):
    return EmployeeService.get_by_id(db_session, employee_id, current_user)

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_employee(employee_data: EmployeeCreate, db_session: Session = Depends(get_db)):
    return EmployeeService.create(db_session, employee_data)

@router.put("/{employee_id}", response_model=EmployeeResponse, dependencies=[Depends(require_admin)])
def update_employee(employee_id: int, employee_data: EmployeeUpdate, db_session: Session = Depends(get_db)):
    return EmployeeService.update(db_session, employee_id, employee_data)

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_employee(employee_id: int, db_session: Session = Depends(get_db)):
    EmployeeService.delete(db_session, employee_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
